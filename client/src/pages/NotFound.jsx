import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '480px', padding: '3rem 2rem' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', marginBottom: '1.25rem' }}>
          <HelpCircle size={48} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#818cf8', marginBottom: '0.25rem' }}>404</h1>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>Page Not Found</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-sm">
          <Home size={16} /> Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
