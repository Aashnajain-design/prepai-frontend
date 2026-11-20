import { useState } from "react";
import axios from "axios";
import "./Analysis.css";
import Navbar from "../components/Navbar";
import ResumeSelect from "../components/ResumeSelect";

function Analysis() {
    const [resumeId, setResumeId] = useState("");
    const [listKey, setListKey] = useState(0);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        const form = e.target;
        setUploading(true);
        setUploadMessage("");

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('resume', file);
            await axios.post('http://localhost:5000/api/upload-resume', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUploadMessage("Resume uploaded!");
            setFile(null);
            form.reset();
            setListKey((k) => k + 1);
        } catch (err) {
            console.log(err);
            setUploadMessage("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

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
                    <h2>Your Resume</h2>
                    <p className="analysis-subtitle">Upload a resume, then get AI-powered feedback</p>

                    <p className="analysis-section-title">1. Upload</p>
                    <form onSubmit={handleUpload} className="upload-row">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button type="submit" disabled={uploading || !file}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </form>
                    {uploadMessage && <p className="upload-message">{uploadMessage}</p>}

                    <hr className="analysis-divider" />

                    <p className="analysis-section-title">2. Analyze</p>
                    <form onSubmit={handleAnalyze}>
                        <ResumeSelect key={listKey} value={resumeId} onChange={setResumeId} />
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