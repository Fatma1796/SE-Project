import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { AuthContext } from '../context/AuthContext.jsx';
import '../CSSmodules/EventDetails.css';
import '../CSSmodules/HomePage.css';
import 'react-toastify/dist/ReactToastify.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [tickets, setTickets] = useState(1);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`/api/v1/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id]);



 const handleBooking = (e) => {
    e.preventDefault();
    axios.post('/api/v1/bookings', {
      eventId: id,
      ticketsBooked: tickets
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        toast.success("Booked successfully!", {
          position: 'top-center',
          autoClose: 3000,
          className: 'custom-toast'
        });

  // Delay navigation so the toast is visible
   
        // Show toast with Cancel Booking button
        const bookingId = res.data.booking._id; // Adjust if your API returns the booking id differently
        // toast(
        //   ({ closeToast }) => (
        //     <div>
        //       Booking successful!
        //       <button
        //         style={{ marginLeft: 10 }}
        //         onClick={() => {
        //           axios.delete(`/api/v1/bookings/${bookingId}`, {
        //             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        //           })
        //             .then(() => {
        //               toast.success('Booking cancelled!');
        //               closeToast();
        //             })
        //             .catch(() => toast.error('Failed to cancel booking.'));
        //         }}
        //     >
        //         Cancel Booking
        //       </button>
        //     </div>
        //   ),
        //   { autoClose: 3000 }
        // );
        setTimeout(() => {
      navigate('/'); // Redirect to homepage after booking
    }, 3000)
  })
    .catch(() => toast.error('Booking failed.'));
};

  if (!event) return <div>Loading...</div>;

 return (
  <div className="event-details-card">
<ToastContainer />

<div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
  <button
    onClick={() => navigate(-1)}
    style={{
      marginRight: "12px",
      backgroundImage: event.image ? `url(${event.image})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#444",
      border: "none",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.4rem",
      color: "#007bff",
      cursor: "pointer",
      transition: "background 0.2s"
    }}
    aria-label="Back"
    onMouseOver={e => e.currentTarget.style.background = "#f0f4ff"}
    onMouseOut={e => e.currentTarget.style.background = "none"}
  >
    ←
  </button>
  <h2 style={{ margin: 0 }}>{event.title}</h2>
</div>
    <p><strong>Description:</strong> {event.description}</p>
    <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
    <p><strong>Location:</strong> {event.location}</p>
    <p><strong>Category:</strong> {event.category}</p>
    <p><strong>Ticket Price:</strong> ${event.ticketPrice}</p>
    <p><strong>Total Tickets:</strong> {event.totalTickets}</p>
    <p><strong>Tickets Available:</strong> {event.remainingTickets === 0 ? "Sold Out" : event.remainingTickets}</p>
   {event.remainingTickets === 0 ? (
  <button disabled style={{ background: "#ccc", cursor: "not-allowed" }}>Sold Out</button>
) : (
  <button
    onClick={user ? () => setShowBooking(true) : () => navigate('/login')}
    disabled={!user}
  >
    {user ? "Book This Event" : "Login to Book"}
  </button>
)}

    {showBooking && (
      <form onSubmit={handleBooking} style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
        <input
          type="number"
          min="1"
          max={event.remainingTickets}
          value={tickets}
          onChange={e => setTickets(Number(e.target.value))}
          required
          style={{ marginRight: "10px" }}
        />
        <span style={{ marginRight: "10px" }}>
          Price is now: ${tickets * event.ticketPrice}
        </span>
        <button type="submit">Confirm Booking</button>
       <button
  type="button"
  onClick={() => {
    setShowBooking(false);
    toast.info('Booking cancelled', {
      position: 'top-center',
      autoClose: 3000,
      className: 'custom-toast'
    });
  }}
  style={{ marginLeft: "10px" }}
>
  Don't book
</button>
      </form>
    )}

  </div>
);
};

export default EventDetails;