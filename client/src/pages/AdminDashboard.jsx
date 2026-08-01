import React, { useState, useEffect, useContext, useRef } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketCard from '../components/TicketCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  Users, 
  Ticket, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  UserCheck, 
  Shield,
  ChevronDown,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignDropdown, setAssignDropdown] = useState({ ticketId: null, isOpen: false, searchValue: '' });
  const dropdownRef = useRef(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Delete modal state
  const [deleteTicketId, setDeleteTicketId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await API.get('/admin/dashboard');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      const usersRes = await API.get('/admin/users');
      if (usersRes.data.success) {
        setUsersList(usersRes.data.users);
        // Filter admin users for assignment dropdown
        const admins = usersRes.data.users.filter(u => u.role === 'admin');
        setAdminUsers(admins);
      }

      await fetchTickets();
    } catch (error) {
      console.error('Failed to load admin dashboard data:', error);
      showToast('Error loading admin dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (search) params.search = search;

      const { data } = await API.get('/admin/tickets', { params });
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && assignDropdown.isOpen) {
        closeAssignDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [assignDropdown.isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const { data } = await API.patch(`/admin/tickets/${ticketId}/status`, { status: newStatus });
      if (data.success) {
        showToast(data.message, 'success');
        setTickets(tickets.map(t => (t._id === ticketId ? data.ticket : t)));
        fetchDashboardData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handlePriorityChange = async (ticketId, newPriority) => {
    try {
      const { data } = await API.patch(`/admin/tickets/${ticketId}/priority`, { priority: newPriority });
      if (data.success) {
        showToast(data.message, 'success');
        setTickets(tickets.map(t => (t._id === ticketId ? data.ticket : t)));
        fetchDashboardData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update priority', 'error');
    }
  };

  const handleAssignChange = async (ticketId, assignedToId) => {
    try {
      const { data } = await API.patch(`/admin/tickets/${ticketId}/assign`, { assignedTo: assignedToId || null });
      if (data.success) {
        showToast(data.message, 'success');
        setTickets(tickets.map(t => (t._id === ticketId ? data.ticket : t)));
        setAssignDropdown({ ticketId: null, isOpen: false, searchValue: '' });
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to assign ticket', 'error');
    }
  };

  const openAssignDropdown = (ticketId) => {
    setAssignDropdown({ ticketId, isOpen: true, searchValue: '' });
  };

  const closeAssignDropdown = () => {
    setAssignDropdown({ ticketId: null, isOpen: false, searchValue: '' });
  };

  const getFilteredAdmins = () => {
    const search = assignDropdown.searchValue.toLowerCase();
    if (!search) return adminUsers;
    return adminUsers.filter(u => 
      u.fullName.toLowerCase().includes(search) || 
      u.email.toLowerCase().includes(search)
    );
  };

  const handleDeleteTicket = async () => {
    if (!deleteTicketId) return;
    try {
      const { data } = await API.delete(`/admin/tickets/${deleteTicketId}`);
      if (data.success) {
        showToast('Ticket deleted cleanly', 'success');
        setTickets(tickets.filter(t => t._id !== deleteTicketId));
        fetchDashboardData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete ticket', 'error');
    } finally {
      setDeleteTicketId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin control panel..." />;

  return (
    <div>
      {/* Title */}
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield color="#6366f1" size={28} /> Admin Management Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            System-wide overview, support ticket routing, staff assignments, and user controls.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <div className="stat-value">{stats.totalTickets}</div>
              <div className="stat-label">Total Tickets</div>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <Ticket size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#fde047' }}>{stats.openTickets}</div>
              <div className="stat-label">Open Tickets</div>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--status-open-bg)', color: '#fde047' }}>
              <AlertCircle size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#60a5fa' }}>{stats.inProgressTickets}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--status-progress-bg)', color: '#60a5fa' }}>
              <Clock size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#4ade80' }}>{stats.resolvedTickets}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--status-resolved-bg)', color: '#4ade80' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div className="stat-value" style={{ color: '#c084fc' }}>{stats.totalUsers}</div>
              <div className="stat-label">Registered Users</div>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <Users size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search tickets by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Account Issue">Account Issue</option>
              <option value="Product Enquiry">Product Enquiry</option>
              <option value="General Support">General Support</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ticket Table / List */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          All Master Tickets ({tickets.length})
        </h3>

        {tickets.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No tickets matching the current criteria.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Ticket</th>
                <th style={{ padding: '0.75rem' }}>User</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Priority</th>
                <th style={{ padding: '0.75rem' }}>Assigned To</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', maxWidth: '220px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ fontWeight: 500 }}>{t.createdBy?.fullName || 'Unknown'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t.createdBy?.email}</div>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{t.category}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <select
                      className="form-select"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      value={t.status}
                      onChange={(e) => handleStatusChange(t._id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <select
                      className="form-select"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      value={t.priority}
                      onChange={(e) => handlePriorityChange(t._id, e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem', position: 'relative' }}>
                    {assignDropdown.ticketId === t._id && assignDropdown.isOpen ? (
                      // Custom searchable dropdown
                      <div
                        ref={dropdownRef}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          zIndex: 1000,
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          minWidth: '250px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          marginTop: '0.25rem'
                        }}
                      >
                        {/* Search Input */}
                        <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                          <input
                            type="text"
                            placeholder="Search admin or type name..."
                            value={assignDropdown.searchValue}
                            onChange={(e) => setAssignDropdown({ ...assignDropdown, searchValue: e.target.value })}
                            autoFocus
                            style={{
                              width: '100%',
                              padding: '0.4rem 0.6rem',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              background: 'var(--bg-main)',
                              color: 'var(--text-main)'
                            }}
                          />
                        </div>

                        {/* Unassigned option */}
                        <div
                          onClick={() => handleAssignChange(t._id, null)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            hoverBackground: 'var(--bg-tertiary)',
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            borderBottom: '1px solid var(--border-color)'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          -- Unassigned --
                        </div>

                        {/* Admin users list */}
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {getFilteredAdmins().length > 0 ? (
                            getFilteredAdmins().map(u => (
                              <div
                                key={u._id}
                                onClick={() => handleAssignChange(t._id, u._id)}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  color: 'var(--text-main)',
                                  borderBottom: '1px solid var(--border-color)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                              >
                                <span>{u.fullName}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{u.email}</span>
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              No admins found
                            </div>
                          )}
                        </div>

                        {/* Manual entry option */}
                        {assignDropdown.searchValue.trim() && !adminUsers.some(u => u.fullName.toLowerCase() === assignDropdown.searchValue.toLowerCase()) && (
                          <div
                            onClick={() => {
                              handleAssignChange(t._id, assignDropdown.searchValue);
                            }}
                            style={{
                              padding: '0.5rem 0.75rem',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              background: 'rgba(99, 102, 241, 0.1)',
                              color: '#6366f1',
                              fontWeight: 600,
                              borderTop: '1px solid var(--border-color)',
                              textAlign: 'center'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.2)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.1)'}
                          >
                            Assign to: "{assignDropdown.searchValue}"
                          </div>
                        )}
                      </div>
                    ) : (
                      // Default button view
                      <button
                        onClick={() => openAssignDropdown(t._id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.8rem',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        {t.assignedTo?.fullName || 'Assign...'}
                        <ChevronDown size={14} />
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteTicketId(t._id)}
                      title="Delete Ticket"
                      style={{ padding: '0.3rem 0.5rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTicketId)}
        title="Delete Support Ticket"
        message="Are you sure you want to permanently delete this ticket? This action cannot be undone."
        confirmText="Delete Ticket"
        isDanger={true}
        onConfirm={handleDeleteTicket}
        onCancel={() => setDeleteTicketId(null)}
      />
    </div>
  );
};

export default AdminDashboard;
