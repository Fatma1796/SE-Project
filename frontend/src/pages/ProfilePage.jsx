import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function ProfilePage() {
    const { user, updateProfile, loading: authLoading, error: authError } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await updateProfile({ name, email });
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="alert alert-info">Loading...</div>;
    if (!user) return <div className="alert alert-warning">Please log in to view your profile.</div>;

    return (
        <div className="card">
            <div className="card-header">
                <h1>My Profile</h1>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {authError && <div className="alert alert-danger">{authError}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;