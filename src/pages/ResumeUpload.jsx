import { useState } from "react";
import axios from "axios";
import "./ResumeUpload.css";
import Navbar from "../components/Navbar";

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/upload-resume', formData, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message);
        } catch (err) {
            console.log(err);
            setMessage('Upload failed');
        }
    };

    return (
        <>
          <Navbar />
          <div className="upload-container">
            <div className="upload-card">
                <h2>Upload Resume</h2>
                <p className="upload-subtitle">Upload your resume to get AI-powered feedback</p>

                <form onSubmit={handleUpload}>
                    <div className="file-input-wrapper">
                        <input type="file" onChange={handleFileChange} accept=".pdf" />
                    </div>
                    <button type="submit">Upload</button>
                </form>

                {message && <p className="upload-message">{message}</p>}
            </div>
          </div>
        </>
    );
}

export default ResumeUpload;