import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    if (authLoading) return <div className="alert alert-info">Loading...</div>;
    if (!user) return <div className="alert alert-warning">Please log in to view your profile.</div>;

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h1>My Profile</h1>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <p>{user.name}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <p>{user.email}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role:</label>
                        <p>{role}</p> {/* Display the role here */}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/update-profile')}
                    >
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;