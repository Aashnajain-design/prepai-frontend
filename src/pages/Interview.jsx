import { useState } from "react";
import axios from "axios";
import "./Interview.css";
import Navbar from "../components/Navbar";

function Interview() {
    const [resumeId, setResumeId] = useState("");
    const [interviewId, setInterviewId] = useState(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const startInterview = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/interview/start/${resumeId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setInterviewId(response.data.interviewId);
            setQuestion(response.data.question);
            setFeedback("");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/interview/answer/${interviewId}`,
                { answer },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFeedback(response.data.feedback);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const resetInterview = () => {
        setInterviewId(null);
        setQuestion("");
        setAnswer("");
        setFeedback("");
    };

    return (
        <>
            <Navbar />
            <div className="interview-container">
                <div className="interview-card">

                    {!interviewId && (
                        <>
                            <h2>Start Mock Interview</h2>
                            <p className="interview-subtitle">Enter your Resume ID to begin</p>
                            <form onSubmit={startInterview}>
                                <input
                                    type="text"
                                    placeholder="Resume ID"
                                    value={resumeId}
                                    onChange={(e) => setResumeId(e.target.value)}
                                />
                                <button type="submit" disabled={loading}>
                                    {loading ? "Starting..." : "Start Interview"}
                                </button>
                            </form>
                        </>
                    )}

                    {interviewId && !feedback && (
                        <>
                            <h2>Question</h2>
                            <p className="interview-question">{question}</p>
                            <form onSubmit={submitAnswer}>
                                <textarea
                                    placeholder="Type your answer here..."
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    rows={6}
                                />
                                <button type="submit" disabled={loading}>
                                    {loading ? "Evaluating..." : "Submit Answer"}
                                </button>
                            </form>
                        </>
                    )}

                    {feedback && (
                        <>
                            <h2>Feedback</h2>
                            <p className="interview-feedback">{feedback}</p>
                            <button onClick={resetInterview}>Start New Interview</button>
                        </>
                    )}

                </div>
            </div>
        </>
    );
}

export default Interview;