import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ResumeSelect.css";

function ResumeSelect({ value, onChange }) {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/resumes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const list = response.data.resumes;
                setResumes(list);
                if (list.length > 0) onChange(list[0]._id);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, []);

    if (loading) return <p className="resume-empty">Loading resumes...</p>;

    if (resumes.length === 0) {
        return (
            <p className="resume-empty">
                No resumes found. <Link to="/resume-upload">Upload one first</Link>
            </p>
        );
    }

    return (
        <select
            className="resume-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                    {r.filename.replace(/^\d+-/, '')} ({new Date(r.uploadedAt).toLocaleDateString()})
                </option>
            ))}
        </select>
    );
}

export default ResumeSelect;