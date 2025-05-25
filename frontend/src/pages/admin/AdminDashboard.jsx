//working admin dashboard
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import UserTable from './UserTable';
import EventTable from './EventTable';
import { Tabs, Tab, Modal, Button } from 'react-bootstrap';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FullPageSpinner from '../../components/common/FullPageSpinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../CSSmodules/HomePage.css'; // Contains .custom-toast if you use it

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null); // For general page errors, not toasts
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Consistent toast notification function
    const showToastNotification = (message, type, actionKey) => {
        const options = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast', // Apply custom class from HomePage.css
            toastId: `${actionKey}-${type}` // Prevents duplicate toasts for the same action-type
        };

        if (type === 'success') {
            toast.success(message, options);
        } else {
            toast.error(message, options);
        }
    };

    const fetchUsers = async () => {
        // setLoading(true); // Already handled by main loading state if needed
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/v1/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users || []);
        } catch (err) {
            setError('Failed to load users.'); // Page level error
            showToastNotification('Failed to load users.', 'error', 'fetch-users');
        }
        // setLoading(false);
    };

    const fetchEvents = async () => {
        // setLoading(true);
        try {
            const response = await axios.get('/api/v1/events');
            setEvents(response.data || []);
        } catch (err) {
            setError('Failed to load events.'); // Page level error
            showToastNotification('Failed to load events.', 'error', 'fetch-events');
        }
        // setLoading(false);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            if (user?.role === 'System Admin') {
                await fetchUsers(); // await to ensure users are fetched before events if there's a dependency
                await fetchEvents();
            }
            setLoading(false);
        };
        loadData();
    }, [user]);

    const handleDeleteUser = async (userId) => {
        // Removed window.confirm for direct deletion
        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/v1/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchUsers(); // Refresh user list
            showToastNotification('User deleted successfully.', 'success', 'delete-user');
        } catch (err) {
            showToastNotification('Failed to delete user.', 'error', 'delete-user');
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/v1/users/${userId}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchUsers(); // Refresh user list
            showToastNotification('User role updated successfully.', 'success', 'update-user-role');
        } catch (err) {
            showToastNotification('Failed to update user role.', 'error', 'update-user-role');
        } finally {
            setProcessing(false);
        }
    };
    
    const handleViewEvent = (eventId) => {
        const event = events.find(e => e._id === eventId || e.id === eventId);
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleUpdateEvent = async (eventId, updatedData) => {
        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/v1/events/${eventId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchEvents(); // Refresh event list
            showToastNotification('Event updated successfully.', 'success', 'update-event');
        } catch (err) {
            showToastNotification('Failed to update event.', 'error', 'update-event');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        // Removed window.confirm for direct deletion
        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/v1/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchEvents(); // Refresh event list
            showToastNotification('Event deleted successfully.', 'success', 'delete-event');
        } catch (err) {
            showToastNotification('Failed to delete event.', 'error', 'delete-event');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <FullPageSpinner text="Loading dashboard data..." />;
    if (!user || user.role !== 'System Admin') {
        return <div className="alert alert-danger">You do not have permission to access this page.</div>;
    }

    return (
        <div className="container mt-4">
            {/* ToastContainer should be rendered once, at a high level */}
            <ToastContainer
                position="top-right"
                autoClose={3000} // Default autoClose, can be overridden by individual toasts
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <h1 className="mb-4">Admin Dashboard</h1>
            {error && <div className="alert alert-danger mt-3">{error}</div>} {/* Display page-level errors */}
            {processing && <div className="text-center py-3"><LoadingSpinner size="medium" text="Processing..." /></div>}
            
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="users" title="Users">
                    <UserTable 
                        users={users} 
                        onDelete={handleDeleteUser} 
                        onUpdateRole={handleUpdateUserRole}
                        processing={processing} 
                    />
                </Tab>
                <Tab eventKey="events" title="Events">
                    <EventTable 
                        events={events} 
                        users={users}
                        onView={handleViewEvent}
                        onUpdate={handleUpdateEvent}
                        onDelete={handleDeleteEvent}
                        processing={processing}
                    />
                </Tab>
            </Tabs>

            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Event Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        <div>
                            <h3>{selectedEvent.title}</h3>
                            <p><strong>Date:</strong> {new Date(selectedEvent.eventDate).toLocaleString()}</p>
                            <p><strong>Location:</strong> {selectedEvent.location || 'N/A'}</p>
                            <p><strong>Status:</strong> {selectedEvent.status}</p>
                            <p><strong>Organizer:</strong> {selectedEvent.organizer?.name || selectedEvent.organizerName || 'Unknown'}</p>
                            <h5>Description</h5>
                            <p>{selectedEvent.description}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;