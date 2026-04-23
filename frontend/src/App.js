import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard'; 
import AdminDashboard from './AdminDashboard';
import StaffLogin from './StaffLogin';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-logo">StudentSupport</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </nav>

      <div className="auth-container">
        <Routes>
          <Route path="/" element={<h2 style={{textAlign: 'center', marginTop: '50px'}}>Welcome! Please login to continue.</h2>} />
          <Route path="/register" element={<div className="auth-card"><Register /></div>} />
          <Route path="/login" element={<div className="auth-card"><Login /></div>} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/staff-login" element={<StaffLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;