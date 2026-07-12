const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');   // naya import
const bcrypt = require('bcrypt');  // naya import
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/prepai')
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('server is running...');
})

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
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

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});