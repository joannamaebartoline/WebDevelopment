import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        address: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8800/signup", formData);
            alert("Signup successful! Please login.");
            navigate("/login"); // Redirect to login page
        } catch (err) {
            console.error("Error during signup:", err.response ? err.response.data : err.message);
            alert(err.response ? err.response.data : "Signup failed. Please try again.");
        }
    };
    
    return (
        <div className="auth-form">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

<input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />

<input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <span onClick={() => navigate("/login")} style={{ color: 'blue', cursor: 'pointer' }}>Login</span></p>
        </div>
    );
};

export default Signup;
