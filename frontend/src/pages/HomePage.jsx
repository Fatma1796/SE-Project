import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventDate: "",
    location: "",
    category: "",
    image: "",
    ticketPrice: "",
    totalTickets: ""
  });
  const navigate = useNavigate();
  const [hoveredEventId, setHoveredEventId] = useState(null);


  useEffect(() => {
    let url = "http://localhost:3000/api/v1/events";
    if (user?.role === "System Admin") {
      url = "http://localhost:3000/api/v1/events/all";
    }
    const fetchEvents = async () => {
      try {
        const res = await axios.get(url, {
          headers: user?.role === "System Admin"
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : undefined,
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, [user]);

  // Add event handler
  const handleAddEvent = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/api/v1/events",
        { ...newEvent, eventDate: new Date(newEvent.eventDate) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        alert("Event added!");
        setNewEvent({
          title: "",
          description: "",
          eventDate: "",
          location: "",
          category: "",
          image: "",
          ticketPrice: "",
          totalTickets: ""
        });
      })
      .catch((err) => {
        console.error("Add event failed", err);
        alert("Failed to add event.");
      });
  };

  // Approve event handler
  const handleApprove = (id) => {
    axios
      .put(
        `http://localhost:3000/api/v1/events/${id}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
      toast.success("Event approved!");
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: "approved" } : e))
      );
      })
      .catch((err) => {
        console.error("Approval failed", err);
       toast.error("Failed to approve event.");
      });
  };

  const approvedEvents = events.filter((e) => e.status === "approved");
  const pendingEvents = events.filter((e) => e.status === "pending");
  const declinedEvents = events.filter((e) => e.status === "declined");
  // Place this with your other handlers, NOT inside the return/JSX
const handleReject = (id) => {
  axios
    .put(
      `http://localhost:3000/api/v1/events/${id}`,
      { status: "declined" },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
    .then(() => {
      toast.info("Event declined!");
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: "declined" } : e))
      );
    })
    .catch((err) => {
      console.error("Rejection failed", err);
      toast.error("Failed to decline event.");
    });
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the Online Event Ticketing System</h1>
    {user?.role !== "System Admin" && (
  <>
      {/* Approved Events - shown to all roles */}
      <h2>Available Events</h2>
 {/*this is the part that makes the events card clickable*/}
{approvedEvents.map((event) => (
  <div
    key={event._id}
    onClick={() => navigate(`/events/${event._id}`)}
    onMouseEnter={() => setHoveredEventId(event._id)}
    onMouseLeave={() => setHoveredEventId(null)}
    style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      minWidth: "250px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      marginBottom: "10px",
      cursor: "pointer",
      transition: "box-shadow 0.2s, border-color 0.2s",
      background: "#fff",
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    }}
  >
    <h3 style={{ margin: "0 0 8px 0" }}>{event.title}</h3>
    <p style={{ margin: "4px 0" }}><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
    <p style={{ margin: "4px 0" }}><strong>Location:</strong> {event.location}</p>
    <p style={{ margin: "4px 0" }}><strong>Ticket Price:</strong> ${event.ticketPrice}</p>
    {hoveredEventId === event._id && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,123,255,0.85)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          fontWeight: "bold",
          zIndex: 2
        }}
      >
        Click me for more details
      </div>
    )}
  </div>
))}
</>
)}

      {/* Organizer Add Event */}
      {user?.role === "Organizer" && (
        <div style={{ marginTop: "40px" }}>
          <h2>Add New Event</h2>
          <form onSubmit={handleAddEvent}>
            <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
            <input type="text" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
            <input type="datetime-local" value={newEvent.eventDate} onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })} required />
            <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} required />
            <input type="text" placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} />
            <input type="text" placeholder="Image URL" value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} />
            <input type="number" placeholder="Ticket Price" value={newEvent.ticketPrice} onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })} required />
            <input type="number" placeholder="Total Tickets" value={newEvent.totalTickets} onChange={(e) => setNewEvent({ ...newEvent, totalTickets: e.target.value })} required />
            <button type="submit">Create Event</button>
          </form>
        </div>
      )}

      {/* System Admin Pending Approval */}
     {user?.role === "System Admin" && (
  <div style={{ marginTop: "40px" }}>
    <h2>All Events (Admin View)</h2>

    <h3>Pending Events</h3>
    {pendingEvents.length === 0 && <p>No pending events.</p>}
    {pendingEvents.map((event) => (
      <div key={event._id} style={{ border: "1px dashed orange", padding: "10px", marginBottom: "10px" }}>
        <h4>{event.title}</h4>
        <p>{event.description}</p>
        <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
        <p>Location: {event.location}</p>
        <p>Price: ${event.ticketPrice}</p>
        <button
          onClick={() => handleApprove(event._id)}
          style={{ marginRight: "10px", background: "#28a745", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px" }}
        >
          Approve
        </button>
        <button
          onClick={() => handleReject(event._id)}
          style={{ background: "#dc3545", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px" }}
        >
          Decline
        </button>
      </div>
    ))}

    <h3>Approved Events</h3>
    {approvedEvents.length === 0 && <p>No approved events.</p>}
    {approvedEvents.map((event) => (
      <div key={event._id} style={{ border: "1px solid #28a745", padding: "10px", marginBottom: "10px" }}>
        <h4>{event.title}</h4>
        <p>Status: Approved</p>
        {/* ...other event details... */}
      </div>
    ))}

    <h3>Declined Events</h3>
    {declinedEvents.length === 0 && <p>No declined events.</p>}
    {declinedEvents.map((event) => (
      <div key={event._id} style={{ border: "1px solid #dc3545", padding: "10px", marginBottom: "10px" }}>
        <h4>{event.title}</h4>
        <p>Status: Declined</p>
        {/* ...other event details... */}
      </div>
    ))}
  </div>
)}
    </div>
  );
}

export default HomePage;

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// function HomePage() {
//   const { user } = useContext(AuthContext);
//   const [events, setEvents] = useState([]);
//   const [tickets, setTickets] = useState(1);
//   const [showBookingFormFor, setShowBookingFormFor] = useState(null);
//   const [newEvent, setNewEvent] = useState({
//     title: "",
//     description: "",
//     eventDate: "",
//     location: "",
//     category: "",
//     image: "",
//     ticketPrice: "",
//     totalTickets: ""
//   });

//   // Fetch all events on load
//   // ...existing code...
//   useEffect(() => {
//     let url = "http://localhost:3000/api/v1/events";
//     // If admin, fetch all events (approved + pending)
//     if (user?.role === "System Admin") {
//       url = "http://localhost:3000/api/v1/events/all";
//     }
//     const fetchEvents = async () => {
//       try {
//         const res = await axios.get(url, {
//           headers: user?.role === "System Admin"
//             ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
//             : undefined,
//         });
//         setEvents(res.data);
//       } catch (err) {
//         console.error("Failed to fetch events", err);
//       }
//     };
//     fetchEvents();
//   }, [user]);
// // ...existing code...

//   // Booking handler
//   const handleBooking = (eventId) => {
//     axios
//       .post(
//         "http://localhost:3000/api/v1/bookings",
//         { eventId, ticketsBooked: tickets },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       )
//       .then(() => {
//         alert("Booking successful!");
//         setShowBookingFormFor(null);
//         setTickets(1);
//       })
//       .catch((err) => {
//         console.error("Booking failed", err);
//         alert("Booking failed. Are you logged in?");
//       });
//   };

//   // Add event handler
//   const handleAddEvent = (e) => {
//     e.preventDefault();
//     axios
//       .post(
//         "http://localhost:3000/api/v1/events",
//         { ...newEvent, eventDate: new Date(newEvent.eventDate) },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       )
//       .then(() => {
//         alert("Event added!");
//         setNewEvent({
//           title: "",
//           description: "",
//           eventDate: "",
//           location: "",
//           category: "",
//           image: "",
//           ticketPrice: "",
//           totalTickets: ""
//         });
//       })
//       .catch((err) => {
//         console.error("Add event failed", err);


//         alert("Failed to add event.");
//       });
//   };

//   // Approve event handler
//   const handleApprove = (id) => {
//     axios
//       .put(
//         `http://localhost:3000/api/v1/events/${id}`,
//         { status: "approved" },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       )
//       .then(() => {
//         alert("Event approved!");
//         setEvents((prev) =>
//           prev.map((e) => (e._id === id ? { ...e, status: "approved" } : e))
//         );
//       })
//       .catch((err) => {
//         console.error("Approval failed", err);
//         alert("Failed to approve event.");
//       });
//   };

//   const approvedEvents = events.filter((e) => e.status === "approved");
//   const pendingEvents = events.filter((e) => e.status === "pending");

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Welcome to the Online Event Ticketing System</h1>

//       {/* Approved Events - shown to all roles */}
//       <h2>Available Events</h2>
//       {approvedEvents.map((event) => (
//         <div key={event._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
//           <h3>{event.title}</h3>
//           <p>{event.description}</p>
//           <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
//           <p>Location: {event.location}</p>
//           <p>Price: ${event.ticketPrice}</p>
//           <button onClick={() => setShowBookingFormFor(event._id)}>Book This Event</button>

//           {showBookingFormFor === event._id && (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleBooking(event._id);
//               }}
//             >
//               <input
//                 type="number"
//                 value={tickets}
//                 min="1"
//                 onChange={(e) => setTickets(Number(e.target.value))}
//                 required
//               />
//               <button type="submit">Confirm Booking</button>
//             </form>
//           )}
//         </div>
//       ))}

//       {/* Organizer Add Event */}
//       {user?.role === "Organizer" && (
//         <div style={{ marginTop: "40px" }}>
//           <h2>Add New Event</h2>
//           <form onSubmit={handleAddEvent}>
//             <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
//             <input type="text" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
//             <input type="datetime-local" value={newEvent.eventDate} onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })} required />
//             <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} required />
//             <input type="text" placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} />
//             <input type="text" placeholder="Image URL" value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} />
//             <input type="number" placeholder="Ticket Price" value={newEvent.ticketPrice} onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })} required />
//             <input type="number" placeholder="Total Tickets" value={newEvent.totalTickets} onChange={(e) => setNewEvent({ ...newEvent, totalTickets: e.target.value })} required />
//             <button type="submit">Create Event</button>
//           </form>
//         </div>
//       )}

//       {/* System Admin Pending Approval */}
//       {user?.role === "System Admin" && (
//         <div style={{ marginTop: "40px" }}>
//           <h2>Pending Events</h2>
//           {pendingEvents.length === 0 && <p>No pending events.</p>}
//           {pendingEvents.map((event) => (
//             <div key={event._id} style={{ border: "1px dashed gray", padding: "10px", marginBottom: "10px" }}>
//               <h3>{event.title}</h3>
//               <p>{event.description}</p>
//               <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
//               <p>Location: {event.location}</p>
//               <p>Price: ${event.ticketPrice}</p>
//               <button onClick={() => handleApprove(event._id)}>Approve This Event</button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default HomePage;




// // import React, { useEffect, useState, useContext } from "react";
// // import axios from "axios";
// // import { AuthContext } from "../context/AuthContext";

// // function HomePage() {
// //   const { user } = useContext(AuthContext); // assumes AuthContext provides user object with role
// //   const [events, setEvents] = useState([]);
// //   const [showBookingFormFor, setShowBookingFormFor] = useState(null);
// //   const [tickets, setTickets] = useState(1);
// //   const [newEvent, setNewEvent] = useState({
// //     title: "",
// //     description: "",
// //     eventDate: "",
// //     location: "",
// //     category: "",
// //     image: "",
// //     ticketPrice: "",
// //     totalTickets: ""
// //   });

// //   // Fetch events
// //   useEffect(() => {
// //     axios.get("http://localhost:3000/api/v1/events")
// //       .then(res => {
// //         setEvents(res.data);
// //       })
// //       .catch(err => {
// //         console.error("Failed to fetch events", err);
// //       });
// //   }, []);

// //   // Handle Booking
// //   const handleBooking = (eventId) => {
// //     axios.post("http://localhost:3000/api/v1/bookings", {
// //       eventId,
// //       ticketsBooked: tickets
// //     }, {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem("token")}`
// //       }
// //     }).then(() => {
// //       alert("Booking successful!");
// //       setShowBookingFormFor(null);
// //       setTickets(1);
// //     }).catch(err => {
// //       console.error("Booking failed", err);
// //       alert("Booking failed. Are you logged in?");
// //     });
// //   };

// //   // Handle Add Event for Organizers
// //   const handleAddEvent = (e) => {
// //     e.preventDefault();
// //     axios.post("http://localhost:3000/api/v1/events", {
// //       ...newEvent,
// //       eventDate: new Date(newEvent.eventDate)
// //     }, {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem("token")}`
// //       }
// //     }).then(() => {
// //       alert("Event added!");
// //       setNewEvent({
// //         title: "",
// //         description: "",
// //         eventDate: "",
// //         location: "",
// //         category: "",
// //         image: "",
// //         ticketPrice: "",
// //         totalTickets: ""
// //       });
// //     }).catch(err => {
// //       console.error("Add event failed", err);
// //       alert("Failed to add event.");
// //     });
// //   };

// //   return (
// //     <div style={{ padding: "20px" }}>
// //       <h1>Welcome to the Online Event Ticketing System</h1>
// //       <p>Explore and book your favorite events!</p>

// //       <h2>Available Events</h2>
// //       {events.map(event => (
// //         <div key={event._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
// //           <h3>{event.title}</h3>
// //           <p>{event.description}</p>
// //           <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
// //           <p>Location: {event.location}</p>
// //           <p>Price: ${event.ticketPrice}</p>
// //           <button onClick={() => setShowBookingFormFor(event._id)}>
// //             Book This Event
// //           </button>

// //           {showBookingFormFor === event._id && (
// //             <form onSubmit={(e) => {
// //               e.preventDefault();
// //               handleBooking(event._id);
// //             }}>
// //               <label>
// //                 Number of Tickets:
// //                 <input
// //                   type="number"
// //                   value={tickets}
// //                   min="1"
// //                   onChange={(e) => setTickets(Number(e.target.value))}
// //                   required
// //                 />
// //               </label>
// //               <button type="submit">Confirm Booking</button>
// //             </form>
// //           )}
// //         </div>
// //       ))}

// //       {user?.role === "Organizer" && (
// //         <div style={{ marginTop: "40px" }}>
// //           <h2>Add New Event</h2>
// //           <form onSubmit={handleAddEvent}>
// //             <input
// //               type="text"
// //               placeholder="Title"
// //               value={newEvent.title}
// //               onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
// //               required
// //             />
// //             <input
// //               type="text"
// //               placeholder="Description"
// //               value={newEvent.description}
// //               onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
// //             />
// //             <input
// //               type="datetime-local"
// //               placeholder="Date"
// //               value={newEvent.eventDate}
// //               onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
// //               required
// //             />
// //             <input
// //               type="text"
// //               placeholder="Location"
// //               value={newEvent.location}
// //               onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
// //               required
// //             />
// //             <input
// //               type="text"
// //               placeholder="Category"
// //               value={newEvent.category}
// //               onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
// //             />
// //             <input
// //               type="text"
// //               placeholder="Image URL"
// //               value={newEvent.image}
// //               onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Ticket Price"
// //               value={newEvent.ticketPrice}
// //               onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
// //               required
// //             />
// //             <input
// //               type="number"
// //               placeholder="Total Tickets"
// //               value={newEvent.totalTickets}
// //               onChange={(e) => setNewEvent({ ...newEvent, totalTickets: e.target.value })}
// //               required
// //             />
// //             <button type="submit">Create Event</button>
// //           </form>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default HomePage;



// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // function HomePage() {
// // //   const [events, setEvents] = useState([]);
// // //   const [selectedEvent, setSelectedEvent] = useState(null);
// // //   const [tickets, setTickets] = useState('');

// // //   useEffect(() => {
// // //     axios.get('http://localhost:3000/api/v1/events')
// // //       .then(res => {
// // //         const approvedEvents = res.data.filter(e => e.status === 'approved');
// // //         setEvents(approvedEvents);
// // //       })
// // //       .catch(err => console.error(err));
// // //   }, []);

// // //   const handleBookClick = (event) => {
// // //     setSelectedEvent(event);
// // //     setTickets('');
// // //   };

// // //   const handleBooking = () => {
// // //     const numTickets = parseInt(tickets, 10);
// // //     if (!numTickets || numTickets <= 0 || isNaN(numTickets)) {
// // //       alert('Please enter a valid number of tickets.');
// // //       return;
// // //     }

// // //     const token = localStorage.getItem('token'); // or sessionStorage, depending on where you store it
// // //     if (!token) {
// // //       alert('No token found. Please log in.');
// // //       return;
// // //     }

// // //     axios.post('http://localhost:3000/api/v1/bookings', {
// // //       eventId: selectedEvent._id,
// // //       ticketsBooked: numTickets
// // //     }, {
// // //       headers: {
// // //         Authorization: `Bearer ${token}`
// // //       }
// // //     })
// // //       .then(() => {
// // //         alert('Booking submitted!');
// // //         setSelectedEvent(null);
// // //         setTickets('');
// // //       })
// // //       .catch(err => {
// // //         console.error(err);
// // //         alert('Booking failed. Are you sure you are logged in?');
// // //       });
// // //   };

// // //   return (
// // //     <div>
// // //       <h1>Welcome to the Online Event Ticketing System</h1>
// // //       <p>Explore and book your favorite events!</p>
// // //       <p>Login or Register to get started.</p>

// // //       <h2>Available Events</h2>
// // //       <ul>
// // //         {events.map(event => (
// // //           <li key={event._id}>
// // //             <strong>{event.title}</strong> — ${event.ticketPrice} — {event.remainingTickets} tickets left
// // //             <br />
// // //             <button onClick={() => handleBookClick(event)}>Book this event</button>
// // //           </li>
// // //         ))}
// // //       </ul>

// // //       {selectedEvent && (
// // //         <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
// // //           <h3>Booking: {selectedEvent.title}</h3>
// // //           <input
// // //             type="number"
// // //             placeholder="Number of tickets"
// // //             value={tickets}
// // //             onChange={(e) => setTickets(e.target.value)}
// // //             min="1"
// // //             max={selectedEvent.remainingTickets}
// // //           />
// // //           <button onClick={handleBooking} style={{ marginLeft: '10px' }}>
// // //             Submit Booking
// // //           </button>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default HomePage;


// // // ;