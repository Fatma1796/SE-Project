import React, { useEffect, useState } from 'react'; // Added useState
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ProfilePage = () => {
    const { user, role, loading: authLoading, updateProfile } = useAuth();
    const navigate = useNavigate();

    // Define state variables
    const [name, setName] = useState(''); // For the user's name
    const [email, setEmail] = useState(''); // For the user's email
    const [bookings, setBookings] = useState([]); // For user bookings
    const [error, setError] = useState(null); // For error messages
    const [success, setSuccess] = useState(null); // For success messages
    const [loading, setLoading] = useState(false); // For loading state

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');

            // Only fetch bookings for Standard Users
            if (user.role === "Standard User") {
                const fetchBookings = async () => {
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
                };

                fetchBookings();
            }
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

    // Handle navigating to bookings
    const handleViewBookings = () => {
        navigate('/my-bookings'); // Navigate to bookings page
    };

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
                        <p>{name}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <p>{email}</p>
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