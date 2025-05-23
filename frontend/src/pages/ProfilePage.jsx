import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Toast notification effect
    useEffect(() => {
        if (location.state?.profileUpdated) {
            toast.success('Profile updated successfully!');
            // Delay clearing the state so the toast can appear
            setTimeout(() => {
                navigate(location.pathname, { replace: true, state: {} });
            }, 300);
        }
        // Only depend on location.state to avoid multiple toasts
        // eslint-disable-next-line
    }, [location.state]);

    // Profile state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                setName(user.name || '');
                setEmail(user.email || '');
                if (user.role === 'Standard User') {
                    try {
                        const token = localStorage.getItem('token');
                        const res = await axios.get('http://localhost:3000/api/v1/users/bookings', {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
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

    if (authLoading || pageLoading) return <FullPageSpinner text="Loading profile..." />;
    if (!user) return <div className="alert alert-warning">Please log in to view your profile.</div>;

    return (
        <div className="container mt-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="card">
                <div className="card-header">
                    <h1>My Profile</h1>
                </div>
                <div className="card-body">
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
                    >
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;