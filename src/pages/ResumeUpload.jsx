import { useState } from "react";
import axios from "axios";

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
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
        } catch (err) {
            console.log(err);
            setMessage('Upload failed');
        }
    };

    return (
        <div>
            <h2>Upload Resume</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} accept=".pdf" />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResumeUpload;