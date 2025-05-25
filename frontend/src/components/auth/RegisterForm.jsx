import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
//import '../../CSSmodules/RegisterForm.css';

function RegisterForm() {
    const { register, error: authError, user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Standard User' // Default to standard user
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            
            setSuccess("Registration successful! Redirecting to login...");
            
            // Redirect after a brief delay to show the success message
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="card mx-auto" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Create an Account</h2>
                    
                    {(error || authError) && (
                        <div className="alert alert-danger" role="alert">
                            {error || authError}
                        </div>
                    )}
                    
                    {success && (
                        <div className="alert alert-success" role="alert">
                            {success}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                autoComplete="name" // Add this

                            />
                        </div>
                        
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
                                minLength="6"
                                 autoComplete="new-password"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                 autoComplete="new-password"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Account Type</label>
                            <select
                                id="role"
                                name="role"
                                className="form-select"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="Standard User">Standard User</option>
                                <option value="Organizer">Organizer</option>
                                <option value="System Admin">System Admin</option>
                            </select>
                        </div>
                        
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <span>Already have an account? </span>
                        <Link to="/login" className="text-decoration-none">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;