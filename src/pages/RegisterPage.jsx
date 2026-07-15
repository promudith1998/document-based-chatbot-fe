import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(username, password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.username || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h1>Create Account</h1>
        <p className="subtitle">Join AI Knowledge Assistant today</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="register-username">Username</label>
            <input id="register-username" type="text" className="input" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} autoFocus />
          </div>
          <div className="input-group">
            <label htmlFor="register-password">Password</label>
            <input id="register-password" type="password" className="input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="input-group">
            <label htmlFor="register-confirm">Confirm Password</label>
            <input id="register-confirm" type="password" className="input" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} id="register-submit">
            {loading ? <><span className="spinner"></span> Creating account...</> : 'Create Account'}
          </button>
        </form>
        <div className="auth-link">Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
