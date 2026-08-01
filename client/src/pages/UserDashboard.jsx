import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Ticket, PlusCircle, Bot, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await API.get('/tickets/my-tickets');
        if (data.success) {
          setTickets(data.tickets);
        }
      } catch (error) {
        console.error('Failed to load tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const progressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  if (loading) return <LoadingSpinner text="Loading user dashboard..." />;

  return (
    <div>
      {/* Dashboard Header */}
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {user?.fullName}! 👋</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Manage your support tickets or consult the AI support assistant.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/ai-chat" className="btn btn-secondary">
            <Bot size={18} color="#06b6d4" /> Ask AI Support
          </Link>
          <Link to="/create-ticket" className="btn btn-primary">
            <PlusCircle size={18} /> New Ticket
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Ticket size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: '#fde047' }}>{openCount}</div>
            <div className="stat-label">Open Tickets</div>
          </div>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--status-open-bg)', color: '#fde047' }}>
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: '#60a5fa' }}>{progressCount}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--status-progress-bg)', color: '#60a5fa' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: '#4ade80' }}>{resolvedCount}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--status-resolved-bg)', color: '#4ade80' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Recent Tickets</h3>
        {tickets.length > 0 && (
          <Link to="/my-tickets" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
            View All ({tickets.length}) &rarr;
          </Link>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Ticket size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Support Tickets Found</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            You haven't submitted any tickets yet. Need help? Create a new support ticket or talk with our AI assistant.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/create-ticket" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Create Ticket
            </Link>
            <Link to="/ai-chat" className="btn btn-secondary btn-sm">
              <Bot size={16} color="#06b6d4" /> Chat with AI
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {tickets.slice(0, 6).map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
