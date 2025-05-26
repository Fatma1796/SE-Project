import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../CSSmodules/AuthForms.css';

function LoginForm() {
    const { login, error: authError, user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Redirect if already logged in
    useEffect(() => {
        if (user) {
               navigate('/');
           // navigate(location.state?.from || '/');
        }
    }, [user, navigate, location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({
                email: formData.email,
                password: formData.password
            });
        } catch (err) {
            setError(err.message || 'Invalid email or password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Welcome Back</h2>
                </div>
                <div className="auth-body">
                    {(error || authError) && (
                        <div className="auth-alert auth-alert-danger" role="alert">
                            {error || authError}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="auth-footer">
                        <div className="mb-2">
                            <Link to="/forgot-password" className="auth-link">
                                Forgot Password?
                            </Link>
                        </div>
                        <div>
                            <span>Need an account? </span>
                            <Link to="/register" className="auth-link">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;