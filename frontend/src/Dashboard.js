import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [formData, setFormData] = useState({ subject: '', category: 'General', description: '' });
    const navigate = useNavigate();

    const savedUser = JSON.parse(localStorage.getItem('user'));

    const fetchUserTickets = useCallback(async () => {
        if (!savedUser) return;
        try {
            const res = await axios.get(`http://127.0.0.1:3001/tickets/user/${savedUser.id}`);
            setTickets(res.data);
        } catch (err) {
            console.error("Error fetching tickets");
        }
    }, [savedUser]);

    useEffect(() => {
        if (!savedUser) {
            navigate('/login');
        } else {
            fetchUserTickets();
        }
    }, [savedUser, navigate, fetchUserTickets]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:3001/tickets', {
                ...formData,
                userId: savedUser.id,
                studentName: savedUser.name,
                status: 'Pending'
            });
            setFormData({ subject: '', category: 'General', description: '' });
            fetchUserTickets();
        } catch (err) {
            alert("Submission failed");
        }
    };

    const formalizeDescription = () => {
        if (!formData.description) return alert("Please type something first!");
        const professionalText = `Dear Support Team,\n\nI am writing to formally report an issue regarding ${formData.category.toLowerCase()}. ${formData.description}. I would appreciate it if this matter could be looked into at your earliest convenience.\n\nRegards,\n${savedUser?.name}`;
        setFormData({ ...formData, description: professionalText });
    };

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>👋 Welcome, {savedUser?.name}</h1>
                    <p style={{ color: '#666' }}>Student Support Portal</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {savedUser?.role === 'staff' && (
                        <button 
                            onClick={() => navigate('/admin')}
                            style={{ background: '#1e293b', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            🛡️ Staff View
                        </button>
                    )}
                    <button 
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
                <div style={{ background: '#f9fafb', padding: '25px', borderRadius: '15px', height: 'fit-content' }}>
                    <h3>Submit a Request</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            placeholder="Subject" required
                            value={formData.subject}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                        <select 
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="General">General</option>
                            <option value="Accommodation">Accommodation</option>
                            <option value="Teaching">Teaching</option>
                            <option value="Facilities">Facilities</option>
                        </select>
                        <textarea 
                            placeholder="Tell us more..." required
                            value={formData.description}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                        <button 
                            type="button" 
                            onClick={formalizeDescription}
                            style={{ 
                                background: '#f3f4f6', 
                                color: '#4f46e5', 
                                border: '1px dashed #4f46e5',
                                padding: '8px', 
                                borderRadius: '8px', 
                                fontSize: '0.8rem', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            🪄 AI: Formalize My Request
                        </button>
                        <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Submit Ticket
                        </button>
                    </form>
                </div>

                <div>
                    <h3>My Support History</h3>
                    {tickets.map(t => (
                        <div key={t._id} style={{ 
                            background: 'white', border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold' }}>{t.subject}</span>
                                <span style={{ fontSize: '0.8rem', color: t.status === 'Resolved' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                                    {t.status.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '5px' }}>{t.description}</p>
                            {t.adminNotes && (
                                <div style={{ background: '#f0fdf4', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                                    <small style={{ color: '#166534', fontWeight: 'bold' }}>💬 Staff Response:</small>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#166534' }}>{t.adminNotes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {tickets.length === 0 && <p style={{ color: '#999' }}>No requests found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;