import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/v1/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBooking(res.data.booking || res.data))
      .catch(() => toast.error('Failed to fetch booking details.'));
  }, [id]);

  const handleCancel = () => {
    const token = localStorage.getItem('token');
    axios.delete(`/api/v1/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success('Booking cancelled!');
        navigate('/my-bookings');
      })
      .catch(() => toast.error('Failed to cancel booking.'));
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "6px 16px",
          background: "#f0f0f0",
          color: "#333",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center"
        }}
      >
        <span style={{ fontSize: "1.2rem", marginRight: "6px" }}>←</span>
        Back
      </button>
      <h2>Booking Details</h2>
      <p><strong>Event:</strong> {booking.event?.title}</p>
      <p><strong>Date:</strong> {booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleString() : "N/A"}</p>
      <p><strong>Location:</strong> {booking.event?.location}</p>
      <p><strong>Tickets:</strong> {booking.numberOfTickets}</p>
      <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
      <button onClick={handleCancel} className="btn btn-danger" style={{ marginTop: 10 }}>
        Cancel Booking
      </button>
    </div>
  );
};
export default BookingDetailsPage;