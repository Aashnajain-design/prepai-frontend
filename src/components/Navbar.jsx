import './Navbar.css'

function Navbar() {
    return (
        <nav className="navbar">
            <h2>prepAi</h2>
            <div className="links">
                <a href="#features">Features</a>
                <a href="/login">Login</a>
                
            </div>
        </nav>
    );
}
export default Navbar;