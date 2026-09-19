import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import Navbar from "../components/Navbar";

function SignUp(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signup', formData);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    }

 return(
    <>
      <Navbar />
      <div className="signup-container">
          <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p className="signup-subtitle">Start your placement prep journey today</p>

          <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          />
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
         <button type="submit">Sign Up</button>

         <p className="signup-footer">
           Already have an account? <a href="/login">Login</a>
         </p>
         </form>
         </div>
    </>
 )
}
export default SignUp;