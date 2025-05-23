import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import default Toastify CSS
import '../CSSmodules/HomePage.css'; // Import custom toast styles (if applicable, like .custom-toast)
import '../services/EditEvent.css'; // Keep your page-specific styles
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming user might be needed for auth checks or data
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [event, setEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    status: 'active', // Default or fetched status
    // Add other event fields as necessary, e.g., category, image, ticketPrice, totalTickets
    category: "",
    image: "",
    ticketPrice: "",
    totalTickets: ""
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        toast.error('Event ID is missing.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            className: 'custom-toast',
            toastId: 'edit-event-missing-id'
        });
        setPageLoading(false);
        navigate('/my-events'); // Or a more appropriate fallback page
        return;
      }
      
      setPageLoading(true);
      try {
        // Assuming your API requires a token to fetch event details for editing
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/v1/events/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const eventData = response.data;
        
        const formattedDate = eventData.eventDate ? 
          new Date(eventData.eventDate).toISOString().slice(0, 16) : '';
        
        setEvent({
          // Spread all fields from eventData
          title: eventData.title || '',
          description: eventData.description || '',
          eventDate: formattedDate,
          location: eventData.location || '',
          status: eventData.status || 'active',
          category: eventData.category || '',
          image: eventData.image || '',
          ticketPrice: eventData.ticketPrice || '',
          totalTickets: eventData.totalTickets || '',
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details. Please try again.', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            className: 'custom-toast',
            toastId: 'edit-event-load-error'
        });
        // Optionally navigate away if event loading fails critically
        // navigate('/my-events'); 
      } finally {
        setPageLoading(false);
      }
    };

    // Ensure user is available if your fetch logic depends on it (e.g., for authorization)
    if (user) {
        fetchEvent();
    } else {
        // Handle cases where user is not authenticated, if editing requires it
        toast.error("Please log in to edit events.", {
            position: "top-center",
            autoClose: 3000,
            toastId: 'edit-event-auth-required'
        });
        navigate('/login'); // Redirect to login
        setPageLoading(false);
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation example
    if (!event.title || !event.eventDate || !event.location) {
        toast.error("Please fill in all required fields (Title, Date, Location).", {
            position: "top-center",
            autoClose: 3000,
            className: 'custom-toast',
            toastId: 'edit-event-validation-error'
        });
        return;
    }
    
    setSaving(true);
    try {
      const eventDataToSubmit = {
        title: event.title,
        description: event.description,
        eventDate: new Date(event.eventDate).toISOString(), // Ensure date is in ISO format for backend
        location: event.location,
        status: event.status,
        category: event.category,
        image: event.image,
        ticketPrice: event.ticketPrice,
        totalTickets: event.totalTickets,
        // Include other fields as needed by your API
      };
      
      const token = localStorage.getItem('token');
      await axios.put(`/api/v1/events/${id}`, eventDataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Event updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        className: 'custom-toast',
        toastId: 'edit-event-update-success'
      });
      // Delay navigation to allow toast to be seen
      setTimeout(() => {
        navigate('/my-events'); // Or navigate to the specific event page: `/events/${id}`
      }, 1500); 
    } catch (error) {
      console.error('Error updating event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update event. Please try again.';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        className: 'custom-toast',
        toastId: 'edit-event-update-error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) return <FullPageSpinner text="Loading event data..." />;

  return (
    <> {/* Use Fragment to wrap ToastContainer and the main div */}
      <ToastContainer />
      <div className="edit-event-page-container"> {/* Changed class name for clarity */}
        <div className="edit-event-form-wrapper"> {/* Wrapper for styling */}
          <h2 className="edit-event-title">Edit Event</h2>
          <form onSubmit={handleSubmit} className="edit-event-form">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={event.title}
                onChange={handleChange}
                className="form-input"
                required
                disabled={saving}
              />
            </div>
            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={event.description}
                onChange={handleChange}
                className="form-input form-textarea"
                disabled={saving}
              />
            </div>
            {/* Event Date */}
            <div className="form-group">
              <label htmlFor="eventDate" className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                id="eventDate"
                name="eventDate"
                value={event.eventDate}
                onChange={handleChange}
                className="form-input"
                required
                disabled={saving}
              />
            </div>
            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={event.location}
                onChange={handleChange}
                className="form-input"
                required
                disabled={saving}
              />
            </div>
            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={event.category}
                onChange={handleChange}
                className="form-input"
                disabled={saving}
              />
            </div>
            {/* Image URL */}
            <div className="form-group">
              <label htmlFor="image" className="form-label">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={event.image}
                onChange={handleChange}
                className="form-input"
                disabled={saving}
              />
            </div>
            {/* Ticket Price */}
            <div className="form-group">
              <label htmlFor="ticketPrice" className="form-label">Ticket Price ($)</label>
              <input
                type="number"
                id="ticketPrice"
                name="ticketPrice"
                value={event.ticketPrice}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="0.01"
                disabled={saving}
              />
            </div>
            {/* Total Tickets */}
            <div className="form-group">
              <label htmlFor="totalTickets" className="form-label">Total Tickets</label>
              <input
                type="number"
                id="totalTickets"
                name="totalTickets"
                value={event.totalTickets}
                onChange={handleChange}
                className="form-input"
                min="1"
                disabled={saving}
              />
            </div>
            {/* Status (if editable by user, otherwise manage internally) */}
            {/* <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select 
                id="status" 
                name="status" 
                value={event.status} 
                onChange={handleChange} 
                className="form-input"
                disabled={saving}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
                <option value="active">Active</option> 
                <option value="cancelled">Cancelled</option>
              </select>
            </div> */}

            <div className="button-group">
              <button type="submit" className="save-button" disabled={saving || pageLoading}>
                {saving ? <LoadingSpinner size="small" text="" /> : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)} // Go back to previous page
                className="cancel-button"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditEventPage;