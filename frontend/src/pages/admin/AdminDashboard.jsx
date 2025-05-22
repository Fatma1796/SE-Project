import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import UserTable from './UserTable';
import EventTable from './EventTable';
import { Tabs, Tab, Modal, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useLoading } from '../../context/LoadingContext';


const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // Default tab
    const { startLoading, stopLoading } = useLoading();
    
    // View event modal state
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const fetchUsers = async () => {
        startLoading('Loading users...');
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Missing authentication token');
            const response = await axios.get('/api/v1/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users || []);
            setError(null);
        } catch (error) {
            setError('Failed to load users. Please try again later.');
        } finally {
            stopLoading();
        }
    };

    const fetchEvents = async () => {
        startLoading('Loading events...');
        try {
            const response = await axios.get('/api/v1/events');
            setEvents(response.data || []);
            setError(null);
        } catch (error) {
            setError('Failed to load events. Please try again later.');
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (user?.role === 'System Admin') {
            const loadData = async () => {
                // First load users
                await fetchUsers();
                // Then load events
                fetchEvents();
            };
            
            loadData();
        }
    }, [user]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/v1/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchUsers();
            } catch (error) {
                setError('Failed to delete user. Please try again.');
            }
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/v1/users/${userId}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            setError('Failed to update user role. Please try again.');
        }
    };

    // Event handling functions
    const handleViewEvent = (eventId) => {
        const event = events.find(e => e._id === eventId || e.id === eventId);
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    const handleUpdateEvent = async (eventId, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/v1/events/${eventId}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents();
            showToast('Event updated successfully', 'success');
        } catch (error) {
            console.error('Error updating event:', error);
            showToast('Failed to update event', 'danger');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/v1/events/${eventId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchEvents();
                showToast('Event deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting event:', error);
                showToast('Failed to delete event', 'danger');
            }
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    if (!user || user.role !== 'System Admin') {
        return <div className="alert alert-danger">You do not have permission to access this page.</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Admin Dashboard</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Toast notification */}
            <ToastContainer position="top-end" className="p-3">
                <Toast 
                    bg={toast.type}
                    show={toast.show} 
                    onClose={() => setToast({...toast, show: false})}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="users" title="Users">
                    <UserTable users={users} onDelete={handleDeleteUser} onUpdateRole={handleUpdateUserRole} />
                </Tab>
                <Tab eventKey="events" title="Events">
                    <EventTable 
                        events={events} 
                        users={users}  // Pass the users data to EventTable
                        onView={handleViewEvent}
                        onUpdate={handleUpdateEvent}
                        onDelete={handleDeleteEvent}
                    />
                </Tab>
            </Tabs>

            {/* View Event Modal */}
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