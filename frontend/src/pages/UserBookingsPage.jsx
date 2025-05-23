import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../CSSmodules/BookingCard.css';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';

function UserBookings() {
    const { getBookings, loading, error } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate();
    const totalSpent = bookings.reduce((sum, booking) => {
      // Adjust these property names if your booking model is different
      const ticketCount = booking.numberOfTickets || booking.ticketsBooked || 1;
      const price = booking.event?.ticketPrice || 0;
      return sum + ticketCount * price;
    }, 0);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getBookings();
                setBookings(data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err.message);
            } finally {
                setPageLoading(false);
            }
        };
        fetchBookings();
    }, [getBookings]);

    if (pageLoading || loading) return <FullPageSpinner text="Loading your bookings..." />;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
      <div className="booking-card" style={{ position: "relative", minHeight: "100px" }}>
        <button
          onClick={() => navigate('/profile')}
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
          aria-label="Back to Profile"
        >
          <span style={{ fontSize: "1.5rem", color: "#007bff" }}>←</span>
        </button>
        <h2 className="text-xl font-bold mb-4" style={{ marginLeft: 60 }}>My Bookings</h2>
        <div style={{ marginBottom: "16px", fontWeight: "bold", marginLeft: 60 }}>
          Total Spent: ${totalSpent}
        </div>
        {bookings.length === 0 ? (
          <p style={{ marginLeft: 60 }}>No bookings found.</p>
        ) : (
          <ul className="space-y-4" style={{ marginLeft: 60 }}>
            {bookings.map((booking) => (
              <li key={booking._id} className="p-4 border rounded shadow" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>{booking.event?.title || "N/A"}</span>
                <button
                  onClick={() => navigate(`/bookings/${booking._id}`)}
                  className="btn btn-primary"
                >
                  Show this booking's details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default UserBookings;
