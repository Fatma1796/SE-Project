import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../CSSmodules/BookingCard.css';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setPageLoading(true);
    axios.get(`/api/v1/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBooking(res.data.booking || res.data))
      .catch(() => toast.error('Failed to fetch booking details.'))
      .finally(() => setPageLoading(false));
  }, [id]);

  const handleCancel = () => {
    const token = localStorage.getItem('token');
    setCancelLoading(true);
    axios.delete(`/api/v1/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success('Booking cancelled!');
        navigate('/my-bookings');
      })
      .catch(() => toast.error('Failed to cancel booking.'))
      .finally(() => setCancelLoading(false));
  };

  if (pageLoading) return <FullPageSpinner text="Loading booking details..." />;
  if (!booking) return <div>No booking found with this ID.</div>;

  return (
    <div className="booking-card" style={{ position: "relative", minHeight: "100px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s"
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = "#f0f4ff";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,123,255,0.12)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        }}
        aria-label="Back"
      >
        <span style={{ fontSize: "1.5rem", color: "#007bff" }}>←</span>
      </button>
      <div style={{ marginLeft: 60 }}>
        <h2>Booking Details</h2>
        <p><strong>Event:</strong> {booking.event?.title}</p>
        <p><strong>Date:</strong> {booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleString() : "N/A"}</p>
        <p><strong>Location:</strong> {booking.event?.location}</p>
        <p><strong>Tickets:</strong> {booking.numberOfTickets}</p>
        <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
        <button 
          onClick={handleCancel} 
          className="btn btn-danger" 
          style={{ marginTop: 10 }}
          disabled={cancelLoading}
        >
          {cancelLoading ? <LoadingSpinner size="small" text="Cancelling..." /> : 'Cancel Booking'}
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsPage;