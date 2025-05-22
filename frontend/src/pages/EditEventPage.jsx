import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoading } from '../context/LoadingContext';
import '../services/EditEvent.css';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startLoading, stopLoading } = useLoading();

  const [event, setEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      startLoading('Loading event details...');
      try {
        const response = await axios.get(`/api/v1/events/${id}`);
        const eventData = response.data;
        
        // Format date for datetime-local input
        const formattedDate = eventData.eventDate ? 
          new Date(eventData.eventDate).toISOString().slice(0, 16) : '';
        
        setEvent({
          ...eventData,
          eventDate: formattedDate
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        stopLoading();
      }
    };

    fetchEvent();
  }, [id, startLoading, stopLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    startLoading('Saving changes...');
    try {
      // Format the data for API
      const eventData = {
        ...event,
        eventDate: new Date(event.eventDate).toISOString()
      };
      
      const token = localStorage.getItem('token');
      await axios.put(`/api/v1/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Event updated successfully');
      navigate('/events');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      stopLoading();
    }
  };

  // Component JSX
  return (
    <div className="edit-event-container">
      <div className="edit-event-container">
        <h2 className="edit-event-title">Edit Event</h2>
        <form onSubmit={handleSubmit} className="edit-event-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              className="form-input form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="datetime-local"
              name="eventDate"
              value={event.eventDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleChange}
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