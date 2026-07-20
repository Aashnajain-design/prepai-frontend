require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/authMiddleware');
const multer = require('multer');
const Resume = require('./models/Resume');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('server is running...');
})

// SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ 
            message: 'signup successful', 
            user: { name: newUser.name, email: newUser.email } 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
})

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { name: user.name, email: user.email } 
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
})

// DASHBOARD ROUTE (protected)
app.get('/api/dashboard', verifyToken, async (req, res) => {
  try {
    res.json({ 
      message: `Welcome to your dashboard, ${req.user.email}!`,
      stats: {
        interviewsCompleted: 0,
        resumeScore: 0
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// RESUME UPLOAD ROUTE
app.post('/api/upload-resume', verifyToken, upload.single('resume'), async (req, res) => {
    try{
        const newResume = new Resume({
            user: req.user.userId,
            filename: req.file.filename
        });
        await newResume.save();
    
  
  res.json({ 
    message: 'Resume uploaded successfully!',
    filename: req.file.filename 
  });
}
catch (err) {
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
}
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});