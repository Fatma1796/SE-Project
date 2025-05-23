import React, { useState } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventTable = ({ events, users, onView, onUpdate, onDelete, processing }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    eventDate: '',
    location: '',
    status: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const startEditing = (event) => {
    // Format date for datetime-local input
    const formattedDate = event.eventDate ? 
      new Date(event.eventDate).toISOString().slice(0, 16) : 
      '';
    
    setEditForm({
      title: event.title || '',
      eventDate: formattedDate,
      location: event.location || '',
      status: event.status || 'active'
    });
    setEditingId(event._id || event.id);
  };

  const saveChanges = (eventId) => {
    // Parse date back to ISO format
    const updatedData = {
      ...editForm,
      eventDate: editForm.eventDate ? new Date(editForm.eventDate).toISOString() : null
    };
    
    onUpdate(eventId, updatedData);
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({
      title: '',
      eventDate: '',
      location: '',
      status: ''
    });
  };

  // Function to get organizer name from users array
  const getOrganizerName = (organizerId) => {
    if (!organizerId) return 'Unknown organizer';
    
    // Look for the organizer in the users array
    if (users && users.length > 0) {
      const organizer = users.find(user => 
        user._id === organizerId || 
        user.id === organizerId
      );
      
      if (organizer) {
        return organizer.name;
      }
    }
    
    // If we have an organizerId but no matching user, show the ID
    return `Organizer ID: ${organizerId}`;
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Organizer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map(event => (
              <tr key={event._id || event.id}>
                <td>{event._id || event.id}</td>
                <td>
                  {editingId === (event._id || event.id) ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="title"
                      value={editForm.title}
                      onChange={handleInputChange}
                    />
                  ) : (
                    event.title
                  )}
                </td>
                <td>
                  {editingId === (event._id || event.id) ? (
                    <input
                      type="datetime-local"
                      className="form-control form-control-sm"
                      name="eventDate"
                      value={editForm.eventDate}
                      onChange={handleInputChange}
                    />
                  ) : (
                    (() => {
                      // Try to parse the date
                      const d = new Date(event.eventDate);
                      return event.eventDate && !isNaN(d)
                        ? d.toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Invalid date';
                    })()
                  )}
                </td>
                <td>
                  {editingId === (event._id || event.id) ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                    />
                  ) : (
                    event.location || 'N/A'
                  )}
                </td>
                <td>
                  {/* Enhanced organizer display logic */}
                  {event.organizer?.name ? 
                    event.organizer.name : 
                    getOrganizerName(
                      typeof event.organizer === 'string' 
                        ? event.organizer 
                        : event.organizer?._id || event.organizerId
                    )
                  }
                </td>
                <td>
                  {editingId === (event._id || event.id) ? (
                    <select
                      className="form-select form-select-sm"
                      name="status"
                      value={editForm.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`badge bg-${event.status === 'active' ? 'success' : event.status === 'cancelled' ? 'danger' : 'secondary'}`}>
                      {event.status}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === (event._id || event.id) ? (
                    <>
                      <button 
                        className="btn btn-sm btn-success me-1" 
                        onClick={() => saveChanges(event._id || event.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn btn-sm btn-info me-1"
                        onClick={() => onView(event._id || event.id)}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => startEditing(event)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(event._id || event.id)}
                        disabled={processing}
                      >
                        {processing ? <LoadingSpinner size="small" text="" /> : 'Delete'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No events found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;