import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleStaffLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:3001/login', { email, password });
            
            if (res.data.user.role === 'staff') {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/admin');
            } else {
                alert("Access Denied: You do not have Staff privileges.");
            }
        } catch (err) {
            alert("Invalid Staff Credentials");
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1e293b' }}>
            <form onSubmit={handleStaffLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '350px', textAlign: 'center' }}>
                <h2 style={{ color: '#1e293b' }}>🏛️ Staff Portal Login</h2>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>Authorized Personnel Only</p>
                
                <input 
                    type="email" placeholder="Staff Email" required 
                    style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd' }}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" placeholder="Password" required 
                    style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd' }}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                    Access Portal
                </button>
                
                <p style={{ marginTop: '20px', fontSize: '0.8rem' }}>
                    <a href="/login" style={{ color: '#4f46e5' }}>Student Login</a>
                </p>
            </form>
        </div>
    );
};

export default StaffLogin;