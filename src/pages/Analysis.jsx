import { useState } from "react";
import axios from "axios";
import "./Analysis.css";
import Navbar from "../components/Navbar";
import ResumeSelect from "../components/ResumeSelect";

function Analysis() {
    const [resumeId, setResumeId] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setAnalysis("");

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/analyze-resume/${resumeId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAnalysis(response.data.analysis);
        } catch (err) {
            if (err.response && err.response.status === 429) {
                setError("Too many requests. Please wait a bit before trying again.");
            } else {
                setError("Analysis failed. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="analysis-container">
                <div className="analysis-card">
                    <h2>Resume Analysis</h2>
                    <p className="analysis-subtitle">Select a resume to get AI-powered feedback</p>

                    <form onSubmit={handleAnalyze}>
                        <ResumeSelect value={resumeId} onChange={setResumeId} />
                        <button type="submit" disabled={loading || !resumeId}>
                            {loading ? "Analyzing..." : "Analyze Resume"}
                        </button>
                    </form>

                    {error && <p className="analysis-error">{error}</p>}

                    {analysis && (
                        <div className="analysis-result">
                            <h3>Feedback</h3>
                            <p>{analysis}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Analysis;