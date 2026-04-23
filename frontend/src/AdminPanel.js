import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:3001/tickets');
                setTickets(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching tickets", err);
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleResolve = async (id) => {
        try {
            await axios.put(`http://localhost:3001/tickets/${id}/resolve`);
            const updatedTickets = tickets.map(t => 
                t._id === id ? { ...t, status: 'Resolved' } : t
            );
            setTickets(updatedTickets);
        } catch (err) {
            alert("Failed to update ticket.");
        }
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading Requests...</p>;

    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ textAlign: 'center', color: '#4f46e5' }}>Staff Support Inbox</h1>
            <div className="forms-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {tickets.length === 0 ? (
                    <p>No help requests found.</p>
                ) : (
                    tickets.map((t) => (
                        <div key={t._id} className="card" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                                <strong style={{ color: '#4f46e5' }}>{t.subject}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <p style={{ margin: '10px 0' }}>{t.description}</p>
                            
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                From: {t.studentName}
                            </div>

                            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ 
                                    background: t.status === 'Resolved' ? '#dcfce7' : '#fef3c7', 
                                    color: t.status === 'Resolved' ? '#166534' : '#92400e', 
                                    padding: '4px 10px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.75rem' 
                                }}>
                                    {t.status}
                                </span>

                                {t.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleResolve(t._id)}
                                        style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem', background: '#4f46e5' }}
                                        className="btn-primary"
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPanel;