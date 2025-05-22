// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';
// import UserTable from './UserTable';
// import EventTable from './EventTable';
// import { Tabs, Tab } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const AdminDashboard = () => {
//     const { user } = useAuth();
//     const [users, setUsers] = useState([]);
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState('users'); // Default to users tab

//     // Function to fetch all users
//     const fetchUsers = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get('/api/v1/users', {
//                 headers: { 
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setUsers(response.data.users || []);
//             console.log("Fetched users:", response.data.users);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setError('Failed to load users. Please try again later.');
//         }
//     };

//     // Function to fetch all events
//     const fetchEvents = async () => {
//         try {
//             const response = await axios.get('/api/v1/events');
//             setEvents(response.data || []);
//         } catch (error) {
//             console.error('Error fetching events:', error);
//             setError('Failed to load events. Please try again later.');
//         }
//     };

//     useEffect(() => {
//         const loadData = async () => {
//             setLoading(true);
//             try {
//                 await fetchUsers();
//                 await fetchEvents();
//             } catch (err) {
//                 console.error('Error loading data:', err);
//                 setError('Something went wrong. Please try again later.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // Only load if user is an admin
//         if (user && user.role === 'System Admin') {
//             loadData();
//         }
//     }, [user]);

//     // Function to delete a user
//     const handleDeleteUser = async (userId) => {
//         if (window.confirm('Are you sure you want to delete this user?')) {
//             try {
//                 const token = localStorage.getItem('token');
//                 await axios.delete(`/api/v1/users/${userId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 // Refresh the users list
//                 fetchUsers();
//             } catch (error) {
//                 console.error('Error deleting user:', error);
//                 setError('Failed to delete user. Please try again.');
//             }
//         }
//     };

//     // Function to update user role
//     const handleUpdateUserRole = async (userId, newRole) => {
//         try {
//             const token = localStorage.getItem('token');
//             await axios.put(`/api/v1/users/${userId}`, 
//                 { role: newRole }, 
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             // Refresh the users list
//             fetchUsers();
//         } catch (error) {
//             console.error('Error updating user role:', error);
//             setError('Failed to update user role. Please try again.');
//         }
//     };

//     if (loading) {
//         return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
//     }

//     if (!user || user.role !== 'System Admin') {
//         return <div className="alert alert-danger">You do not have permission to access this page.</div>;
//     }

//     return (
//         <div className="container mt-4">
//             <h1 className="mb-4">Admin Dashboard</h1>
            
//             {error && <div className="alert alert-danger">{error}</div>}
            
//             <Tabs
//                 activeKey={activeTab}
//                 onSelect={(k) => setActiveTab(k)}
//                 className="mb-3"
//              >
//                 <Tab eventKey="users" title="Users">
//                     <div className="card">
//                         <div className="card-header d-flex justify-content-between align-items-center">
//                             <h2 className="mb-0">Users Management</h2>
//                         </div>
//                         <div className="card-body">
//                             <UserTable 
//                                 users={users} 
//                                 onDelete={handleDeleteUser}
//                                 onUpdateRole={handleUpdateUserRole}
//                             />
//                         </div>
//                     </div>
//                 </Tab>
//                 <Tab eventKey="events" title="Events">
//                     <div className="card">
//                         <div className="card-header">
//                             <h2 className="mb-0">Events Management</h2>
//                         </div>
//                         <div className="card-body">
//                             <EventTable events={events} />
//                         </div>
//                     </div>
//                 </Tab>
//             </Tabs>
//         </div>
//     );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import UserTable from './UserTable';
import EventTable from './EventTable';
import { Tabs, Tab } from 'react-bootstrap';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // Default tab

    const fetchUsers = async () => {
        setLoadingUsers(true);
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
            setLoadingUsers(false);
        }
    };

    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {
            const response = await axios.get('/api/v1/events');
            setEvents(response.data || []);
            setError(null);
        } catch (error) {
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoadingEvents(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'System Admin') {
            fetchUsers();
            fetchEvents();
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

    if (!user || user.role !== 'System Admin') {
        return <div className="alert alert-danger">You do not have permission to access this page.</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Admin Dashboard</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="users" title="Users">
                    {loadingUsers ? (
                        <div className="spinner-border text-center" role="status"></div>
                    ) : (
                        <UserTable users={users} onDelete={handleDeleteUser} onUpdateRole={handleUpdateUserRole} />
                    )}
                </Tab>
                <Tab eventKey="events" title="Events">
                    {loadingEvents ? (
                        <div className="spinner-border text-center" role="status"></div>
                    ) : (
                        <EventTable events={events} />
                    )}
                </Tab>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;