import '../services/EventPage.css';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';
import {  toast ,ToastContainer} from 'react-toastify';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'Organizer') {
      fetchMyEvents();
    }
  }, [user]);

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => (event._id || event.eventId || event.id) !== eventId));
  //   toast.success('Event deleted successfully!', {
  //   className: 'custom-toast', // This class should be defined in homepage.css
  //   position: 'top-right',
  //   autoClose: 3000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  // });
};
  

  if (loading) return <FullPageSpinner text="Loading your events..." />;

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
      <ToastContainer />
    </div>
  );
};

export default MyEventsPage;