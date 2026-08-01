import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Bot, 
  Ticket, 
  PlusCircle, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Home
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          <Bot size={26} color="#818cf8" />
          <span>OmniSupport AI</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Home size={18} /> Home
            </NavLink>
          </li>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <li>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </NavLink>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink to="/user/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                      <LayoutDashboard size={18} /> Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-tickets" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                      <Ticket size={18} /> My Tickets
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/create-ticket" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                      <PlusCircle size={18} /> New Ticket
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink to="/ai-chat" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <Bot size={18} color="#06b6d4" /> AI Support
                </NavLink>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <Link to="/profile" className="user-badge" title="View Profile">
                  <User size={16} />
                  <span>{user.fullName}</span>
                  {user.role === 'admin' && (
                    <span style={{ background: '#6366f1', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', color: '#fff' }}>ADMIN</span>
                  )}
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                  <LogOut size={16} />
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Login
                </NavLink>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
