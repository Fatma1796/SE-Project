import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';

const ProfilePage = () => {
    const { user, role, loading: authLoading, updateProfile } = useAuth();
    const navigate = useNavigate();

    // Define state variables
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                setName(user.name || '');
                setEmail(user.email || '');

                // Only fetch bookings for Standard Users
                if (user.role === "Standard User") {
                    try {
                        const token = localStorage.getItem('token');
                        const res = await axios.get('http://localhost:3000/api/v1/users/bookings', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            withCredentials: true
                        });

                        setBookings(res.data.bookings || []);
                    } catch (err) {
                        console.error('Error fetching bookings:', err);
                    }
                }
                setPageLoading(false);
            }
        };

        loadProfile();
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

    // Handle navigating to bookings
    const handleViewBookings = () => {
        navigate('/my-bookings');
    };

    if (authLoading || pageLoading) return <FullPageSpinner text="Loading profile..." />;
    if (!user) return <div className="alert alert-warning">Please log in to view your profile.</div>;

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h1>My Profile</h1>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    
                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <p>{name}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <p>{email}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role:</label>
                        <p>{role}</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/update-profile')}
                        disabled={loading}
                    >
                        {loading ? <LoadingSpinner size="small" text="" /> : 'Update Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;