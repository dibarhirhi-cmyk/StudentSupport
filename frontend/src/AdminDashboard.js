import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [allTickets, setAllTickets] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [summaries, setSummaries] = useState({}); 
    const navigate = useNavigate();

    const fetchAllTickets = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:3001/tickets');
            setAllTickets(res.data);
        } catch (err) {
            console.error("Error fetching tickets", err);
        }
    };

 useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));

        if (!savedUser || savedUser.role !== 'staff') {
            alert("🛑 Access Denied! This area is for Staff only.");
            navigate('/dashboard');
        } else {
            fetchAllTickets();
        }
    }, [navigate]);

    const resolveTicket = async (id) => {
        const feedback = prompt("How was this resolved? (e.g. Fixed leak, Sent email)");
        if (!feedback) return; 

        try {
            await axios.put(`http://127.0.0.1:3001/tickets/${id}/resolve`, {
                adminNotes: feedback 
            });
            fetchAllTickets();
        } catch (err) {
            alert("Failed to resolve");
        }
    };

    const analyzeIssue = (id, description, category) => {
        const desc = description.toLowerCase();
        let priority = "Low";
        let action = "Investigate";

        if (desc.includes('leak') || desc.includes('fire') || desc.includes('broken') || desc.includes('emergency')) {
            priority = "🚨 URGENT";
            action = "Dispatch Maintenance immediately";
        } else if (category === 'Teaching') {
            priority = "Medium";
            action = "Forward to Department Head";
        }

        const aiBrief = `📌 AI BRIEF: ${priority} priority. Action: ${action}. Summary: ${description.substring(0, 40)}...`;
        
        setSummaries(prev => ({ ...prev, [id]: aiBrief }));
    };

    const filteredTickets = allTickets.filter(t => {
        const matchesCategory = filter === 'All' || t.category === filter;
        const matchesSearch = t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ background: '#64748b', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ⬅️ Back to Student View
                </button>
                <button 
                    onClick={() => { localStorage.clear(); navigate('/login'); }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0 }}>🏛️ Staff Portal</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        placeholder="Search student..." 
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Facilities">Facilities</option>
                        <option value="General">General</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredTickets.map(ticket => (
                    <div key={ticket._id} style={{ 
                        background: 'white', 
                        padding: '20px', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        borderTop: `5px solid ${ticket.status === 'Resolved' ? '#10b981' : '#f59e0b'}` 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' }}>{ticket.category}</span>
                            <span style={{ fontSize: '0.75rem', color: ticket.status === 'Resolved' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>{ticket.status}</span>
                        </div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{ticket.subject}</h3>
                        <p style={{ color: '#444', fontSize: '0.9rem', marginBottom: '15px' }}>{ticket.description}</p>

                        {summaries[ticket._id] ? (
                            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #dcfce7', fontSize: '0.85rem', marginBottom: '15px', color: '#166534' }}>
                                {summaries[ticket._id]}
                            </div>
                        ) : (
                            <button 
                                onClick={() => analyzeIssue(ticket._id, ticket.description, ticket.category)}
                                style={{ background: '#eff6ff', border: '1px solid #3b82f6', color: '#3b82f6', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '15px', fontWeight: 'bold' }}
                            >
                                🪄 AI: Analyze Issue
                            </button>
                        )}

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                            <p style={{ fontSize: '0.8rem', color: '#888', margin: '0' }}>By: <strong>{ticket.studentName}</strong></p>
                        </div>

                        {ticket.status !== 'Resolved' && (
                            <button 
                                onClick={() => resolveTicket(ticket._id)}
                                style={{ width: '100%', marginTop: '15px', background: '#4f46e5', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                ✅ Mark as Resolved
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {filteredTickets.length === 0 && <p style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>No tickets found.</p>}
        </div>
    );
};

export default AdminDashboard;