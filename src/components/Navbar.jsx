import './Navbar.css'
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <h2>prepAi</h2>
            <div className="nav-links">
                <a href="#features">Features</a>
                {token ? (
                    <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
                ) : (
                    <a href="/login">Login</a>
                )}
            </div>
        </nav>
    );
}
export default Navbar;