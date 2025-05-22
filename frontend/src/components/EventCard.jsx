

// export default EventCard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventCard = ({ event, onDelete }) => {
  const navigate = useNavigate();
  const eventId = event._id || event.eventId || event.id;

  const formatDateTime = (dateString) => {
    const eventDate = new Date(dateString);
    const date = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const time = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date, time };
  };

  const { date, time } = formatDateTime(event.eventDate);

const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/v1/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Call onDelete only after successful deletion
        if (onDelete) {
          onDelete(eventId);
        }
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete event');
      }
    }
  };
 
 
  return (
    <div className="event-card">
      <ToastContainer  enableMultiContainer 
        containerId="delete-toast"
        style={{ position: 'fixed' }}
      />
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        <span className={`event-status status-${event.status}`}>
          {event.status}
        </span>
      </div>
      <div className="event-content">
        <div className="event-info">
          <p>Description: {event.description}</p>
          <p className="event-datetime">
            <span className="datetime-label">Date:</span>
            &nbsp;
            <span className="datetime-value">{date} {time}</span>
          </p>
          <p>Location: {event.location}</p>
          <p>Price: ${typeof event.ticketPrice === 'number' ? event.ticketPrice.toFixed(2) : '0.00'}</p>
          <p>Tickets: {event.totalTickets}</p>
          <p>Category: {event.category}</p>
        </div>
      </div>
      <div className="event-actions">
        <button
          onClick={() => navigate(`/my-events/${eventId}/edit`)}
          className="btn btn-edit"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;