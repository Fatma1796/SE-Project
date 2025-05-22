import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import '../CSSmodules/HomePage.css';


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
  const [showEventsSidebar, setShowEventsSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSidebarEvent, setSelectedSidebarEvent] = useState(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);


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
        toast.success('Event added successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        className: 'custom-toast'});
        // alert("Event added!");
        setShowAddEventForm(false); // <-- Close the form here!
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
              toast.error('Failed to add event. Please try again.', {
 position: "top-center",
        autoClose: 3000
              });
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
          <ToastContainer />

     {/* This will ensure the event list is only visible to public users and Standard Users, not to Organizers or System Admins. */}
  {(!user || user.role === "Standard User") && (
  <div className="home-container">
    <h1 className="welcome-title">Welcome to the Online Event Ticketing System</h1>
    <h2>Available Events</h2>
    {/* --- FILTERS START --- */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", minWidth: 160 }}
      />
      <select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", minWidth: 140 }}
      >
        <option value="">All Categories</option>
        {[...new Set(events.map(e => e.category).filter(Boolean))].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice || ""}
        onChange={e => setMinPrice(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", width: 100 }}
        min={0}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice || ""}
        onChange={e => setMaxPrice(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", width: 100 }}
        min={0}
      />
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}
      />
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </div>
    {/* --- FILTERS END --- */}
    <div className="event-grid">
      {approvedEvents
        .filter(event =>
          (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (!categoryFilter || event.category === categoryFilter) &&
          (!minPrice || Number(event.ticketPrice) >= Number(minPrice)) &&
          (!maxPrice || Number(event.ticketPrice) <= Number(maxPrice)) &&
          (!startDate || new Date(event.eventDate) >= new Date(startDate)) &&
          (!endDate || new Date(event.eventDate) <= new Date(endDate))
        )
        .map(event => (
          <div
            className="event-card"
            key={event._id}
            onClick={() => navigate(`/events/${event._id}`)}
          >
            <div className="event-title">{event.title}</div>
            <div className="event-info"><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</div>
            <div className="event-info"><strong>Location:</strong> {event.location}</div>
            <div className="event-price">${event.ticketPrice}</div>
          </div>
        ))}
    </div>
  </div>
 )} 

      {/* Organizer Add Event */}

 



{user?.role === "Organizer" && (
  <div style={{ display: "flex", alignItems: "flex-start" }}>
    {/* Sidebar */}
    <div style={{
      minWidth: 260,
      marginRight: 32,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: "18px 12px"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Welcome Organizer</h2>
      <button
        onClick={() => setShowEventsSidebar((prev) => !prev)}
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #007bff 60%, #ff6f61 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 0",
          fontWeight: 600,
          fontSize: "1.1rem",
          cursor: "pointer",
          marginBottom: 12,
          transition: "background 0.2s"
        }}
      >
        {showEventsSidebar ? "Hide" : "Show"} Available Events
      </button>
      {/* Create Event Button */}
      <button
        onClick={() => setShowAddEventForm((prev) => !prev)}
        style={{
          width: "100%",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 0",
          fontWeight: 600,
          fontSize: "1.05rem",
          cursor: "pointer",
          marginBottom: 10
        }}
      >
        {showAddEventForm ? "Close Event Form" : "Create a New Event"}
      </button>
      {/* Edit My Events Button */}
      <button
        onClick={() => navigate('/my-events')}
        style={{
          width: "100%",
          background: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 0",
          fontWeight: 600,
          fontSize: "1.05rem",
          cursor: "pointer",
          marginBottom: 10
        }}
      >
        Edit My Events
      </button>
      {/* ...existing sidebar code... */}
     {showEventsSidebar && (
  <div style={{ marginTop: 10 }}>
    {/* Search & Filter */}
    <div style={{ marginBottom: 12 }}>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", marginBottom: 6, width: "100%" }}
      />
      <select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", width: "100%" }}
      >
        <option value="">All Categories</option>
        {[...new Set(events.map(e => e.category).filter(Boolean))].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
    {/* Filtered Event List */}
    {approvedEvents
      .filter(event =>
        (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!categoryFilter || event.category === categoryFilter)
      )
      .map(event => (
        <div
          key={event._id}
          className="event-card"
          style={{
            marginBottom: 10,
            cursor: "pointer",
            background: selectedSidebarEvent && selectedSidebarEvent._id === event._id ? "#f0f4ff" : "#fff",
            border: selectedSidebarEvent && selectedSidebarEvent._id === event._id ? "2px solid #007bff" : "1px solid #eee",
            borderRadius: 8,
            padding: 8
          }}
          onClick={() => setSelectedSidebarEvent(event)}
        >
          <div className="event-title" style={{ fontSize: "1rem" }}>{event.title}</div>
          <div className="event-info" style={{ fontSize: "0.95rem" }}>
            {new Date(event.eventDate).toLocaleDateString()}
          </div>
        </div>
      ))}
    {/* Event Details in Sidebar */}
    {selectedSidebarEvent && (
      <div style={{
        marginTop: 18,
        background: "#f8fafc",
        borderRadius: 10,
        padding: 14,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        position: "relative"
      }}>
        {/* Close button */}
        <button
          onClick={() => setSelectedSidebarEvent(null)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            color: "#888",
            cursor: "pointer"
          }}
          aria-label="Close details"
        >
          ×
        </button>
        <h3 style={{ marginTop: 0 }}>{selectedSidebarEvent.title}</h3>
        <p><strong>Date:</strong> {new Date(selectedSidebarEvent.eventDate).toLocaleString()}</p>
        <p><strong>Location:</strong> {selectedSidebarEvent.location}</p>
        <p><strong>Category:</strong> {selectedSidebarEvent.category}</p>
        <p><strong>Ticket Price:</strong> ${selectedSidebarEvent.ticketPrice}</p>
        <p><strong>Total Tickets:</strong> {selectedSidebarEvent.totalTickets}</p>
        <p><strong>Tickets Available:</strong> {selectedSidebarEvent.remainingTickets}</p>
        <p><strong>Description:</strong> {selectedSidebarEvent.description}</p>
      </div>
    )}
  </div>
)}
    </div>
{/* Main Content: Add Event Form */}
<div className="add-event-container" style={{ flex: 1 }}>
  {showAddEventForm && (
    <div
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: "32px 24px 24px 24px",
        maxWidth: 420,
        margin: "50px auto", // adds spacing and centers vertically
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setShowAddEventForm(false)}
        style={{
          position: "absolute",
          top: 12,
          right: -180,
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          color: "#666",
          cursor: "pointer",
        }}
        aria-label="Close form"
      >
        ×
      </button>

      <h2 style={{ marginTop: 16, marginBottom: 24, textAlign: "center" }}>
        Add New Event
      </h2>
      <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
        <input type="text" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
        <input type="datetime-local" value={newEvent.eventDate} onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })} required />
        <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} required />
        <input type="text" placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} />
        <input type="text" placeholder="Image URL" value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} />
        <input type="number" placeholder="Ticket Price" value={newEvent.ticketPrice} onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })} required />
        <input type="number" placeholder="Total Tickets" value={newEvent.totalTickets} onChange={(e) => setNewEvent({ ...newEvent, totalTickets: e.target.value })} required />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>
          Create Event
        </button>
      </form>
    </div>
  )}
</div>

  </div>
)}






      {/* System Admin Pending Approval */}
  {user?.role === "System Admin" && (
  <div className="admin-section">
    <h2>All Events (Admin View)</h2>
    {/* --- FILTERS START --- */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", minWidth: 160 }}
      />
      <select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", minWidth: 140 }}
      >
        <option value="">All Categories</option>
        {[...new Set(events.map(e => e.category).filter(Boolean))].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice || ""}
        onChange={e => setMinPrice(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", width: 100 }}
        min={0}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice || ""}
        onChange={e => setMaxPrice(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", width: 100 }}
        min={0}
      />
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}
      />
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </div>
    {/* --- FILTERS END --- */}

    <h3 style={{ color: "orange" }}>Pending Events</h3>
    {pendingEvents
      .filter(event =>
        (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!categoryFilter || event.category === categoryFilter) &&
        (!minPrice || Number(event.ticketPrice) >= Number(minPrice)) &&
        (!maxPrice || Number(event.ticketPrice) <= Number(maxPrice)) &&
        (!startDate || new Date(event.eventDate) >= new Date(startDate)) &&
        (!endDate || new Date(event.eventDate) <= new Date(endDate))
      )
      .length === 0 && <p>No pending events.</p>}
    {pendingEvents
      .filter(event =>
        (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!categoryFilter || event.category === categoryFilter) &&
        (!minPrice || Number(event.ticketPrice) >= Number(minPrice)) &&
        (!maxPrice || Number(event.ticketPrice) <= Number(maxPrice)) &&
        (!startDate || new Date(event.eventDate) >= new Date(startDate)) &&
        (!endDate || new Date(event.eventDate) <= new Date(endDate))
      )
      .map((event) => (
        <div key={event._id} className="admin-event-card pending">
          <h4>{event.title}</h4>
          <p>{event.description}</p>
          <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Price:</strong> ${event.ticketPrice}</p>
          <div className="admin-actions">
            <button
              onClick={() => handleApprove(event._id)}
              style={{ background: "#28a745", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px" }}
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
        </div>
      ))}

    <h3 style={{ color: "#28a745" }}>Approved Events</h3>
    {approvedEvents
      .filter(event =>
        (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!categoryFilter || event.category === categoryFilter) &&
        (!minPrice || Number(event.ticketPrice) >= Number(minPrice)) &&
        (!maxPrice || Number(event.ticketPrice) <= Number(maxPrice)) &&
        (!startDate || new Date(event.eventDate) >= new Date(startDate)) &&
        (!endDate || new Date(event.eventDate) <= new Date(endDate))
      )
      .length === 0 && <p>No approved events.</p>}
    {approvedEvents
      .filter(event =>
        (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!categoryFilter || event.category === categoryFilter) &&
        (!minPrice || Number(event.ticketPrice) >= Number(minPrice)) &&
        (!maxPrice || Number(event.ticketPrice) <= Number(maxPrice)) &&
        (!startDate || new Date(event.eventDate) >= new Date(startDate)) &&
        (!endDate || new Date(event.eventDate) <= new Date(endDate))
      )
      .map((event) => (
        <div key={event._id} className="admin-event-card approved">
          <h4>{event.title}</h4>
          <p>Status: Approved</p>
          {/* ...other event details... */}
        </div>
      ))}

    <h3 style={{ color: "#dc3545" }}>Declined Events</h3>
    {declinedEvents
      .filter(event =>
        (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!categoryFilter || event.category === categoryFilter) &&
        (!minPrice || Number(event.ticketPrice) >= Number(minPrice)) &&
        (!maxPrice || Number(event.ticketPrice) <= Number(maxPrice)) &&
        (!startDate || new Date(event.eventDate) >= new Date(startDate)) &&
        (!endDate || new Date(event.eventDate) <= new Date(endDate))
      )
      .length === 0 && <p>No declined events.</p>}
    {declinedEvents
      .filter(event =>
        (!searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!categoryFilter || event.category === categoryFilter) &&
        (!minPrice || Number(event.ticketPrice) >= Number(minPrice)) &&
        (!maxPrice || Number(event.ticketPrice) <= Number(maxPrice)) &&
        (!startDate || new Date(event.eventDate) >= new Date(startDate)) &&
        (!endDate || new Date(event.eventDate) <= new Date(endDate))
      )
      .map((event) => (
        <div key={event._id} className="admin-event-card declined">
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

