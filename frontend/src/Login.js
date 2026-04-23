import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:3001/login', formData);
 
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setMessage(`Welcome back, ${response.data.user.name}!`);

            if (response.data.user.role === 'staff') {
                navigate('/admin');
            } else {
                navigate('/dashboard'); 
            }
            
        } catch (error) {
            setMessage(error.response?.data?.error || "Login failed");
        } 
    }; 

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>🎓 Student Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required
                />
                <button 
                    style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} 
                    type="submit"
                >
                    Sign In
                </button>
            </form>

            {message && (
                <p style={{ marginTop: '15px', color: message.includes('Welcome') ? '#10b981' : '#ef4444' }}>
                    {message}
                </p>
            )}

            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                New here? <Link to="/register" style={{ color: '#4f46e5' }}>Create an account</Link>
            </p>

            <p style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                Are you staff? <Link to="/staff-login" style={{ color: '#64748b' }}>Staff Portal</Link>
            </p>
        </div>
    );
};

export default Login;