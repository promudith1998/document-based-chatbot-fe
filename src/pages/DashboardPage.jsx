import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    dashboardAPI.get()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="app-layout"><div className="main-content">
        <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="spinner" style={{ width: 40, height: 40 }}></span>
        </div>
      </div></div>
    );
  }

  const statCards = [
    { icon: '💬', value: stats?.totalConversations || 0, label: 'Total Conversations' },
    { icon: '✉️', value: stats?.totalMessages || 0, label: 'Messages Sent' },
    { icon: '📄', value: stats?.totalDocuments || 0, label: 'Documents Uploaded' },
  ];

  return (
    <div className="app-layout">
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, <strong>{user?.username || stats?.username}</strong>! Here's your usage overview.</p>
        </div>
        <div className="page-body">
          <div className="dashboard-grid">
            {statCards.map((card, i) => (
              <div key={i} className="stat-card fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="stat-card-icon">{card.icon}</div>
                <div className="stat-card-value">{card.value}</div>
                <div className="stat-card-label">{card.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/chat" className="btn btn-primary btn-lg" id="quick-start-chat">💬 Start New Chat</a>
              <a href="/documents" className="btn btn-secondary btn-lg" id="quick-upload-doc">📁 Upload Document</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
