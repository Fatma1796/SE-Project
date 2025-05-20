import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserBookings() {
    const { getBookings, loading, error } = useAuth();
    const [bookings, setBookings] = useState([]);
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
            }
        };
        fetchBookings();
    }, [getBookings]);

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div>
            <button
                onClick={() => navigate('/profile')}
                style={{
                    marginBottom: "20px",
                    padding: "6px 16px",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                ← Back to Profile
            </button>
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
            <div style={{ marginBottom: "16px", fontWeight: "bold" }}>
            Total Spent: ${totalSpent}
            </div>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul className="space-y-4">
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
}

export default UserBookings;
