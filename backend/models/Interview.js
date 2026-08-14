const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [
        {
            question: String,
            answer: String,
            feedback: String
        }
    ],
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
        const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;