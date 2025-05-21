
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../services/EditEvent.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          toast.error('No event ID provided');
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
        toast.error('Failed to load event details');
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
      toast.success('Event updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate('/my-events');
      }, 1500);
    } catch (err) {
      console.error('Failed to update event:', err);
      toast.error('Failed to update event');
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="edit-event-container">
      <ToastContainer />
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
    </div>
  );
};

export default EditEventPage;