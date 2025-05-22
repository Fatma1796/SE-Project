
       
import '../services/EventPage.css';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import EventCard from '../components/EventCard';


const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const res = await axios.get('http://localhost:3000/api/v1/users/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const eventsData = res.data.events || [];
        setEvents(eventsData);
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };

    if (user?.role === 'Organizer') {
      fetchMyEvents();
    }
  }, [user]);

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => (event._id || event.eventId || event.id) !== eventId));
  };


return (
    <div className="event-page">
      <h2 className="event-title">My Events</h2>
      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <div className="event-grid">
          {events.map(event => (
            <EventCard 
              key={event._id || event.eventId || event.id}
              event={event}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );

};


export default MyEventsPage;