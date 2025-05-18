import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [otpValue, setOtpValue] = useState(null);
    const { forgotPassword } = useAuth();
    
const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
        setError('Please enter your email address');
        return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
        // Request OTP
        const responseData = await forgotPassword(email);
        console.log("OTP response:", responseData);
        
        // Store the OTP value from the response
        if (responseData && responseData.otp) {
            setOtpValue(responseData.otp);
            setSuccess(`OTP sent to your email: ${responseData.otp}`); // In a real app, you wouldn't show this
            setShowOtpForm(true);
        } else {
            setError('Failed to generate OTP. Please try again.');
        }
    } catch (err) {
        console.error('Error requesting OTP:', err);
        setError(err.message || 'An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
};
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            setError('Please enter both OTP and new password');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Reset password with OTP
            const response = await axios.put('/api/v1/users/forgetPassword', {
                email,
                otp,
                newPassword
            }, {
                withCredentials: true
            });
            
            setSuccess('Password has been reset successfully');
            setShowOtpForm(false);
            setEmail('');
            setOtp('');
            setNewPassword('');
        } catch (err) {
            console.error('Error resetting password:', err);
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="card mx-auto" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Forgot Password</h2>
                    
                    {!showOtpForm ? (
                        <>
                            <p className="text-muted mb-4">
                                Enter your email address and we'll send you an OTP to reset your password.
                            </p>
                            
                            <form onSubmit={handleRequestOtp}>
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
                                        {loading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <p className="text-muted mb-4">
                                Enter the OTP sent to your email and your new password.
                            </p>
                            
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group mb-3">
                                    <label htmlFor="otp" className="form-label">OTP</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        className="form-control"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter OTP"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group mb-3">
                                    <label htmlFor="newPassword" className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                                
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                    
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