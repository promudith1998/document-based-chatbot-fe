import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your AI Knowledge Assistant</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-username">Username</label>
            <input id="login-username" type="text" className="input" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" className="input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} id="login-submit">
            {loading ? <><span className="spinner"></span> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <div className="auth-link">Don't have an account? <Link to="/register">Create one</Link></div>
      </div>
    </div>
  );
}
