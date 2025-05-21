import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

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
               navigate('/profile');
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
        <div className="login-container">
            <div className="card mx-auto" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Login</h2>
                    
                    {(error || authError) && (
                        <div className="alert alert-danger" role="alert">
                            {error || authError}
                        </div>
                    )}
                    

                      <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                aria-describedby="emailHelp"
                            />
                            <small id="emailHelp" className="form-text text-muted">
                                Enter your registered email address
                            </small>
                        </div>


                    {/* <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label">
                                Email
                                <input
                                    type="email"
                                    className="form-control mt-1"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <small className="form-text text-muted">
                                Enter your registered email address
                            </small>
                        </div> */}
                        
                           <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                 aria-label="Password field"
                            />
                        </div>
                        

                        {/* <div className="mb-3">
                            <label className="form-label">
                                Password
                                <input
                                    type="password"
                                    className="form-control mt-1"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div> */}
                        
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <Link to="/forgot-password" className="text-decoration-none">
                            Forgot Password?
                        </Link>
                    </div>
                    
                    <div className="text-center mt-3">
                        <span>Do not have an account? </span>
                        <Link to="/register" className="text-decoration-none">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;