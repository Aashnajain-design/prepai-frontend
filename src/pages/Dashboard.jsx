import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <>
      <Navbar />
      <p className="loading-text">Loading...</p>
    </>
  );
  
  if (error) return (
    <>
      <Navbar />
      <p className="error-text">{error}</p>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{data.message}</h1>
         
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Interviews Completed</p>
            <p className="stat-value">{data.stats.interviewsCompleted}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Resume Score</p>
            <p className="stat-value">{data.stats.resumeScore}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;