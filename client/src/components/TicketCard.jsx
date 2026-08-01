import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, User, ArrowRight } from 'lucide-react';

const TicketCard = ({ ticket, isAdmin = false }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="badge badge-resolved">Resolved</span>;
      case 'In Progress':
        return <span className="badge badge-progress">In Progress</span>;
      default:
        return <span className="badge badge-open">Open</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="badge badge-high">High</span>;
      case 'Medium':
        return <span className="badge badge-medium">Medium</span>;
      default:
        return <span className="badge badge-low">Low</span>;
    }
  };

  const formattedDate = new Date(ticket.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {getStatusBadge(ticket.status)}
            {getPriorityBadge(ticket.priority)}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} /> {formattedDate}
          </span>
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {ticket.title}
        </h4>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          {ticket.description}
        </p>
      </div>

      <div style={{
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Tag size={14} /> {ticket.category}
          </span>
          {isAdmin && ticket.createdBy && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-purple)' }}>
              <User size={14} /> {ticket.createdBy.fullName || 'User'}
            </span>
          )}
        </div>

        <Link to={`/tickets/${ticket._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
          Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
