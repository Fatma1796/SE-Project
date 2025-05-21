// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const EventCard = ({ event, onDelete }) => {
//   const navigate = useNavigate();
//   const eventId = event._id || event.eventId || event.id;

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this event?')) {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`http://localhost:3000/api/v1/events/${eventId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         onDelete(eventId);
//       } catch (err) {
//         console.error('Delete failed:', err);
//         alert('Failed to delete event');
//       }
//     }
//  };

//   return (
//     <div className="border rounded-lg shadow-sm p-4">
//       <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
//       <div className="text-black-600 mb-4">
//         <p>Description: {event.description}</p>
//         <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
//         <p>Location: {event.location}</p>
//         <p>Price: ${typeof event.ticketPrice === 'number' ? event.ticketPrice.toFixed(2) : '0.00'}</p>
//         <p>Tickets: {event.totalTickets}</p>
//         <p>Status: {event.status}</p>
//         <p>Category: {event.category}</p>
//       </div>
//       <div className="flex gap-2">
//         <button
//           onClick={() => navigate(`/my-events/${eventId}/edit`)}
//           className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Edit
//         </button>
//         <button
//           onClick={handleDelete}
//           className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const EventCard = ({ event, onDelete }) => {
//   const navigate = useNavigate();
//   const eventId = event._id || event.eventId || event.id;

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this event?')) {
//       try {
//         const token = localStorage.getItem('token');
//         await axios.delete(`http://localhost:3000/api/v1/events/${eventId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         onDelete(eventId);
//       } catch (err) {
//         console.error('Delete failed:', err);
//         alert('Failed to delete event');
//       }
//     }
//   };
// // export default EventCard;
// const EventCard = ({ event, onDelete }) => {
//   const navigate = useNavigate();
//   const eventId = event._id || event.eventId || event.id;

//   return (
//     <div className="event-card">
//       <div className="event-header">
//         <h3 className="event-title">{event.title}</h3>
//         <span className={`event-status status-${event.status}`}>
//           {event.status}
//         </span>
//       </div>
//       <div className="event-content">
//         <div className="event-info">
//           <p>{event.description}</p>
//           <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
//           <p>Location: {event.location}</p>
//           <p>Price: ${typeof event.ticketPrice === 'number' ? event.ticketPrice.toFixed(2) : '0.00'}</p>
//           <p>Tickets: {event.totalTickets}</p>
//           <p>Category: {event.category}</p>
//         </div>
//       </div>
//       <div className="event-actions">
//         <button
//           onClick={() => navigate(`/my-events/${eventId}/edit`)}
//           className="btn btn-edit"
//         >
//           Edit
//         </button>
//         <button
//           onClick={() => onDelete(eventId)}
//           className="btn btn-delete"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };
// }
// export default EventCard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventCard = ({ event, onDelete }) => {
  const navigate = useNavigate();
  const eventId = event._id || event.eventId || event.id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/v1/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onDelete(eventId);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div className="event-card">
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        <span className={`event-status status-${event.status}`}>
          {event.status}
        </span>
      </div>
      <div className="event-content">
        <div className="event-info">
          <p>Description: {event.description}</p>
          <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
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