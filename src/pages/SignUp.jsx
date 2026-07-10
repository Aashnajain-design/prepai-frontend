import { useState } from "react";
function SignUp(){
    const [formData , setFormData] = useState({
        name:"",
        email:"",
        password:""
    })


 const handleChange = (e) =>{
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
 }

 const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(formData);
 }
 return(
    <div className="signup-container">
        <form onSubmit={handleSubmit}>
        <h2>Create Account </h2>

        <input
        type="text"
        name="name"
        placeholder=" Full Name"
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
       <button type = "submit">Sign Up</button>
       </form>
       </div>
 )

}
export default SignUp;