import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState('');

  useEffect(() => {
    axios.get('/api/v1/events') // Public route for approved events
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBookClick = (event) => {
    setSelectedEvent(event);
    setTickets('');
  };

  const handleBooking = () => {
    axios.post('/api/v1/bookings', {
      eventId: selectedEvent._id,
      numberOfTickets: tickets
    })
    .then(() => {
      alert('Booking successful!');
      setSelectedEvent(null);
    })
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            {event.title}
            <button onClick={() => handleBookClick(event)}>Book this event</button>
          </li>
        ))}
      </ul>

      {selectedEvent && (
        <div>
          <h3>Book: {selectedEvent.title}</h3>
          <input
            type="number"
            placeholder="Number of tickets"
            value={tickets}
            onChange={(e) => setTickets(e.target.value)}
          />
          <button onClick={handleBooking}>Submit Booking</button>
        </div>
      )}
    </div>
  );
};

export default EventList;
