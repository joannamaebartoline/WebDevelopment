import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './auth.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Email:", formData.email);  // Log the email
        console.log("Password:", formData.password);  // Log the password
        try {
            const res = await axios.post("http://localhost:8800/adminlogin", formData);
            localStorage.setItem("user", JSON.stringify(res.data)); // Save user data
            navigate("/admin"); // Navigate to admin dashboard
        } catch (err) {
            console.error("Error during login:", err);
            alert("Login failed. Please check your credentials.");
        }
    };
    

    return (
        <div className="auth-form">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
