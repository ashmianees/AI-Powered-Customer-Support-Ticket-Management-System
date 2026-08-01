import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bot, Ticket, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Hero Section */}
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '1.5rem', color: '#818cf8', fontSize: '0.875rem', fontWeight: 600 }}>
          <Zap size={16} /> Powered by Google Gemini AI
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Next-Gen AI Support & Ticket Management
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          Instantly resolve customer inquiries using Google Gemini AI, or seamlessly route technical requests to support staff.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            user.role === 'admin' ? (
              <Link to="/admin/dashboard" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
                Go to Admin Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/user/dashboard" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            )
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
                Sign In
              </Link>
            </>
          )}
          <Link to="/ai-chat" className="btn btn-secondary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', borderColor: 'var(--accent-cyan)' }}>
            <Bot size={18} color="#06b6d4" /> Try AI Assistant
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#06b6d4' }}>
            <Bot size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>24/7 AI Virtual Assistant</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Instant responses powered by Google Gemini SDK to answer common queries, technical troubleshooting, and account questions in real time.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#6366f1' }}>
            <Ticket size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Smart Ticket Lifecycle</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Create, categorize, track status changes, and manage high-priority technical issues with full history and staff assignment.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: '#a855f7' }}>
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem' }}>Admin Control Center</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time analytics dashboard for administrators to monitor ticket volumes, assign team members, and update ticket statuses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
