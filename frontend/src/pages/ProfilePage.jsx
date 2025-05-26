import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSSmodules/HomePage.css'; 
import '../CSSmodules/ProfilePage.css';


const ProfilePage = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Toast notification effect - Move this before other useEffects to ensure it runs first
    useEffect(() => {
        // Check if we have the profileUpdated flag in the location state
        if (location.state?.profileUpdated) {
            // Use setTimeout to ensure the toast appears after render
            setTimeout(() => {
                toast.success('Profile updated successfully!', {
                    position: "top-right", // Changed to top-right for better visibility
                    autoClose: 5000, // Extended duration to make sure it's visible
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    toastId: 'profile-updated' // Add unique ID to prevent duplicate toasts
                });
            }, 100);
            
            // Clear the state after displaying toast
            setTimeout(() => {
                navigate(location.pathname, { replace: true, state: {} });
            }, 500);
        }
    }, [location.state, navigate, location.pathname]);

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
            {/* Place ToastContainer at the top level with explicit props */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="card">
                <div className="card-header">
                    <h1>My Profile</h1>
                </div>
                <div className="card-body">
                    <div className="profile-info">
                        <label className="form-label">Name:</label>
                        <p>{name}</p>
                    </div>
                    <div className="profile-info">
                        <label className="form-label">Email:</label>
                        <p>{email}</p>
                    </div>
                    <div className="profile-info">
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