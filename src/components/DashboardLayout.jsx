import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🧠</span>
            <span>AI Knowledge</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} id="nav-dashboard">
            <span className="nav-icon">📊</span><span>Dashboard</span>
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} id="nav-chat">
            <span className="nav-icon">💬</span><span>Chat</span>
          </NavLink>
          <NavLink to="/documents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} id="nav-documents">
            <span className="nav-icon">📁</span><span>Documents</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="user-details">
              <div className="user-name">{user?.username}</div>
              <div className="user-role">Member</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ width: '100%', marginTop: '0.5rem' }} id="logout-btn">
            🚪 Sign Out
          </button>
        </div>
      </div>
      <Outlet />
    </>
  );
}
