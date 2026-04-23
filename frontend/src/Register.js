import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
        setMessage("All fields are required!");
        return;
    }
    if (formData.password.length < 6) {
        setMessage("Password must be at least 6 characters.");
        return;
    }

        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/register', formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button className="btn-primary" type="submit">Get Started</button>
            </form>
            
            {message && <p className="message">{message}</p>}
            
            <p className="switch-text">
                Already have an account? <Link to="/login" className="switch-link">Login here</Link>
            </p>
        </div>
    );
};

export default Register;