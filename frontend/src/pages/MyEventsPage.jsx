

  
// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from "../context/AuthContext";

// const MyEventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMyEvents = async () => {
//       try {
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           console.error('No authentication token found');
//           return;
//         }
// // Add this inside your fetchMyEvents function after the axios call

//         const res = await axios.get('http://localhost:3000/api/v1/users/events', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });

//         // Log the raw response to see what we're getting
//         console.log('Raw response:', res.data);
//    const eventsData = res.data.events || [];
//        // const eventsData = Array.isArray(res.data) ? res.data : res.data.events || [];
//         // Map the events to ensure consistent ID field
//         console.log('Event prices:', eventsData.map(event => ({
//   title: event.title,
//   price: event.ticketPrice,
//   priceType: typeof event.ticketPrice
// })));
//         const mappedEvents = eventsData.map(event => ({
//           ...event,
//           _id: event._id || event.eventId || event.id // Try different possible ID fields
//         }));
//  console.log('Mapped events:', mappedEvents);
//         setEvents(mappedEvents);
//       } catch (err) {
//         console.error('Failed to load events:', err);
//       }
//     };

//     if (user?.role === 'Organizer') {
//       fetchMyEvents();
//     }
//   }, [user]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">My Events</h2>
//       {events.length === 0 ? (
//         <p>You haven't created any events yet.</p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {events.map(event => {
//             // Get the ID using fallbacks
//             const eventId = event._id || event.eventId || event.id;
            
//             if (!eventId) {
//               console.error('Event missing ID:', event);
//               return null;
//             }

//             return (
//               <div key={eventId} className="border rounded-lg shadow-sm p-4">
//                 <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
//                 <div className="text-black-600 mb-4">
//                   <p>Description: {event.description}</p>
//                   <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
//                   <p>Location: {event.location}</p>
// <p>Price: ${typeof event.ticketPrice === 'number' ? event.ticketPrice.toFixed(2) : '0.00'}</p>                  <p>Tickets: {event.totalTickets}</p>
//                   <p>Status: {event.status}</p>
//                   <p>Category: {event.category}</p>
//                   <p>Status: {event.status}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => navigate(`/my-events/${eventId}/edit`)}
//                     className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={async () => {
//                       if (window.confirm('Are you sure you want to delete this event?')) {
//                         try {
//                           const token = localStorage.getItem('token');
//                           await axios.delete(`http://localhost:3000/api/v1/events/${eventId}`, {
//                             headers: { Authorization: `Bearer ${token}` }
//                           });
//                           setEvents(events.filter(e => (e._id || e.eventId || e.id) !== eventId));
//                         } catch (err) {
//                           console.error('Delete failed:', err);
//                           alert('Failed to delete event');
//                         }
//                       }
//                     }}
//                     className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyEventsPage;
  

       
   import '../services/EventPage.css';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import EventCard from '../components/EventCard';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const res = await axios.get('http://localhost:3000/api/v1/users/events', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const eventsData = res.data.events || [];
        setEvents(eventsData);
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };

    if (user?.role === 'Organizer') {
      fetchMyEvents();
    }
  }, [user]);

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => (event._id || event.eventId || event.id) !== eventId));
  };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">My Events</h2>
//       {events.length === 0 ? (
//         <p>You haven't created any events yet.</p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {events.map(event => (
//             <EventCard 
//               key={event._id || event.eventId || event.id}
//               event={event}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyEventsPage;
return (
    <div className="event-page">
      <h2 className="event-title">My Events</h2>
      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <div className="event-grid">
          {events.map(event => (
            <EventCard 
              key={event._id || event.eventId || event.id}
              event={event}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );

};


export default MyEventsPage;