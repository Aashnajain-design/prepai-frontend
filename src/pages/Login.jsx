import { useState } from "react";
import axios from "axios";

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
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

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
            </form>
        </div>
    );
}

export default Login;