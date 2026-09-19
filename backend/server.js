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
const pdfParse = require('pdf-parse');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const rateLimiter = require('./middleware/rateLimiter');
const app = express();
const Interview = require('./models/Interview');

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
        const filePath = `uploads/${req.file.filename}`;
        const fileBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(fileBuffer);
        
        const newResume = new Resume({
            user: req.user.userId,
            filename: req.file.filename,
            extractedText: pdfData.text
        });
        await newResume.save();
    
  
  res.json({ 
    message: 'Resume uploaded successfully!',
    textPreview: pdfData.text.substring(0, 200)
  });
}
catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
}
});

// RESUME ANALYSIS ROUTE
app.post('/api/analyze-resume/:resumeId', verifyToken, rateLimiter(5, 0.017), async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const prompt = `You are an experienced HR recruiter. Analyze the following resume and provide feedback in this exact format:

Strengths:
- (list 3 strengths)

Weaknesses:
- (list 3 weaknesses)

Suggestions:
- (list 3 suggestions for improvement)

Resume text:
${resume.extractedText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt
    });
    const analysisText = result.text;

    res.json({ 
      message: 'Analysis complete',
      analysis: analysisText 
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Analysis failed', error: err.message });
  }
});

// INTERVIEW START ROUTE
app.post('/api/interview/start/:resumeId', verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const prompt = `You are an interviewer conducting a mock interview. Based on the following resume, ask ONE relevant technical or behavioral interview question. Just give the question directly, no extra text.

Resume text:
${resume.extractedText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt
    });
    const questionText = result.text;

    const newInterview = new Interview({
      user: req.user.userId,
      questions: [
        { question: questionText, answer: '', feedback: '' }
      ]
    });
    await newInterview.save();

    res.json({ 
      message: 'Interview started',
      interviewId: newInterview._id,
      question: questionText
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to start interview', error: err.message });
  }
});

// INTERVIEW ANSWER ROUTE
app.post('/api/interview/answer/:interviewId', verifyToken, async (req, res) => {
  try {
    const { answer } = req.body;
    const interview = await Interview.findById(req.params.interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const lastQuestionIndex = interview.questions.length - 1;
    const currentQuestion = interview.questions[lastQuestionIndex].question;

    const evaluationPrompt = `You are an interviewer evaluating a candidate's answer. 

Question asked: ${currentQuestion}
Candidate's answer: ${answer}

Provide brief, constructive feedback (2-3 sentences) on this answer.`;

    const result = await genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: evaluationPrompt
    });
    const feedbackText = result.text;

    interview.questions[lastQuestionIndex].answer = answer;
    interview.questions[lastQuestionIndex].feedback = feedbackText;
    await interview.save();

    res.json({ 
      message: 'Answer evaluated',
      feedback: feedbackText
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to evaluate answer', error: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});

console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');