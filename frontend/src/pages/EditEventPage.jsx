import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../services/EditEvent.css';  // Add this import

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
          if (!id) {
        console.error('No event ID provided');
        navigate('/my-events');
        return;
      }
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        alert('Failed to load event details');
        navigate('/my-events');
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/v1/events/${id}`,
        event,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Event updated successfully');
      navigate('/my-events');
    } catch (err) {
      console.error('Failed to update event:', err);
      alert('Failed to update event');
    }
  };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Title</label>
//           <input
//             type="text"
//             value={event.title}
//             onChange={e => setEvent({...event, title: e.target.value})}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Description</label>
//           <textarea
//             value={event.description}
//             onChange={e => setEvent({...event, description: e.target.value})}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Date</label>
//           <input
//             type="datetime-local"
//             value={event.eventDate?.slice(0, 16)}
//             onChange={e => setEvent({...event, eventDate: e.target.value})}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Location</label>
//           <input
//             type="text"
//             value={event.location}
//             onChange={e => setEvent({...event, location: e.target.value})}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Price</label>
//           <input
//             type="number"
//             value={event.ticketPrice}
//             onChange={e => setEvent({...event, ticketPrice: e.target.value})}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Total Tickets</label>
//           <input
//             type="number"
//             value={event.totalTickets}
//             onChange={e => setEvent({...event, totalTickets: e.target.value})}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div className="flex gap-4">
//           <button
//             type="submit"
//             className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Save Changes
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate('/my-events')}
//             className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditEventPage;


  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="edit-event-container">
      <h2 className="edit-event-title">Edit Event</h2>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            value={event.title}
            onChange={e => setEvent({...event, title: e.target.value})}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={event.description}
            onChange={e => setEvent({...event, description: e.target.value})}
            className="form-input form-textarea"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="datetime-local"
            value={event.eventDate?.slice(0, 16)}
            onChange={e => setEvent({...event, eventDate: e.target.value})}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            value={event.location}
            onChange={e => setEvent({...event, location: e.target.value})}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Price</label>
          <input
            type="number"
            value={event.ticketPrice}
            onChange={e => setEvent({...event, ticketPrice: e.target.value})}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Total Tickets</label>
          <input
            type="number"
            value={event.totalTickets}
            onChange={e => setEvent({...event, totalTickets: e.target.value})}
            className="form-input"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="save-button">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-events')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;