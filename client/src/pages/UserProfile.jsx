import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '1.25rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <User size={48} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user?.fullName}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{user?.email}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Mail size={20} color="var(--primary)" />
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>Email Address</span>
              <span style={{ fontWeight: 600 }}>{user?.email}</span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Shield size={20} color="var(--accent-purple)" />
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>Role</span>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {user?.role} {user?.role === 'admin' ? '(System Administrator)' : '(Support Customer)'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%' }}>
            <LogOut size={18} /> Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
