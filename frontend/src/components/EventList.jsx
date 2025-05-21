import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/v1/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {events.map(event => (
          <div
            key={event._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              minWidth: "250px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{event.title}</h3>
            <p style={{ margin: "4px 0" }}><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
            <p style={{ margin: "4px 0" }}><strong>Location:</strong> {event.location}</p>
            <p style={{ margin: "4px 0" }}><strong>Ticket Price:</strong> ${event.ticketPrice}</p>
            <button
              onClick={() => navigate(`/events/${event._id}`)}
              style={{
                marginTop: "10px",
                padding: "6px 16px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              View Event Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;