import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Use the forgotPassword function from AuthContext
            await forgotPassword(email);
            setSuccess('Password reset link has been sent to your email address');
            setEmail('');
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="card mx-auto" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Forgot Password</h2>
                    
                    <p className="text-muted mb-4">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Reset Password'}
                            </button>
                        </div>
                        
                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="alert alert-success mt-3" role="alert">
                                {success}
                            </div>
                        )}
                    </form>
                    
                    <div className="text-center mt-3">
                        <Link to="/login" className="text-decoration-none">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;