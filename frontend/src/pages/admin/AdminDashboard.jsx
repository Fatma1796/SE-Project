import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../context/AuthContext.jsx";
import { getUsers, getEvents } from '../../services/api';
import UserTable from './UserTable';
import EventTable from './EventTable';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await getUsers();
                const eventsData = await getEvents();
                setUsers(usersData);
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Users</h2>
            <UserTable users={users} />
            <h2>Events</h2>
            <EventTable events={events} />
        </div>
    );
};

export default AdminDashboard;