import { useState } from "react";
import axios from "axios";
import "./Login.css";
import Navbar from "../components/Navbar";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', formData);
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
          <Navbar />
          <div className="login-container">
              <form onSubmit={handleSubmit}>
                  <h2>Welcome Back</h2>
                  <p className="login-subtitle">Login to continue your prep journey</p>

                  <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                  />
                  <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                  />
                  <button type="submit">Login</button>

                  <p className="login-footer">
                    Don't have an account? <a href="/signup">Sign up</a>
                  </p>
              </form>
          </div>
        </>
    );
}

export default Login;