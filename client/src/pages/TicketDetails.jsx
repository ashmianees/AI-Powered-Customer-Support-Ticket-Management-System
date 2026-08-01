import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  ArrowLeft, 
  Clock, 
  Tag, 
  User, 
  Edit, 
  Trash2, 
  UserCheck 
} from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await API.get(`/tickets/${id}`);
        if (data.success) {
          setTicket(data.ticket);
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to load ticket details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleDelete = async () => {
    try {
      const endpoint = user.role === 'admin' ? `/admin/tickets/${id}` : `/tickets/${id}`;
      const { data } = await API.delete(endpoint);
      if (data.success) {
        showToast('Ticket deleted successfully', 'success');
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-tickets');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete ticket', 'error');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching ticket details..." />;
  if (!ticket) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Ticket Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The requested ticket does not exist or you lack permission to view it.</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const isOwner = ticket.createdBy._id === user?.id || ticket.createdBy._id === user?._id;
  const canModify = (isOwner && ticket.status === 'Open') || user?.role === 'admin';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className={`badge ${ticket.status === 'Resolved' ? 'badge-resolved' : ticket.status === 'In Progress' ? 'badge-progress' : 'badge-open'}`}>
                {ticket.status}
              </span>
              <span className={`badge ${ticket.priority === 'High' ? 'badge-high' : ticket.priority === 'Medium' ? 'badge-medium' : 'badge-low'}`}>
                {ticket.priority} Priority
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{ticket.title}</h2>
          </div>

          {canModify && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {ticket.status === 'Open' && (
                <Link to={`/edit-ticket/${ticket._id}`} className="btn btn-secondary btn-sm">
                  <Edit size={16} /> Edit
                </Link>
              )}
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Metadata info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(0, 0, 0, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Category</span>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={16} color="var(--primary)" /> {ticket.category}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Submitted By</span>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="var(--accent-purple)" /> {ticket.createdBy?.fullName || 'User'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Assigned Staff</span>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserCheck size={16} color="var(--accent-cyan)" /> {ticket.assignedTo?.fullName || 'Unassigned'}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.2rem' }}>Created Date</span>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--text-muted)" /> {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Ticket Description</h4>
          <div style={{
            background: 'var(--bg-input)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap'
          }}>
            {ticket.description}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action is permanent."
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default TicketDetails;
