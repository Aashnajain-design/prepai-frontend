import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo"><h2>prepAi</h2></Link>
            <div className="nav-links">
                {token ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/analysis">Resume Analysis</Link>
                        <Link to="/interview">Interview</Link>
                        <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <a href="/#features">Features</a>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                        
                    </>
                )}
            </div>
        </nav>
    );
}
export default Navbar;