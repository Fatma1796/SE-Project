import React from 'react';

const EventTable = ({ events }) => {
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
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>{event.organizer?.name || 'Unknown'}</td>
                <td>
                  <span className={`badge bg-${event.status === 'active' ? 'success' : 'secondary'}`}>
                    {event.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-info me-1">View</button>
                  <button className="btn btn-sm btn-warning me-1">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
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