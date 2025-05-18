import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function UserBookings() {
    const { getBookings, loading, error } = useAuth();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getBookings();
                console.log('Bookings fetched:', data);
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
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul className="space-y-4">
                    {bookings.map((booking) => (
                        <li key={booking._id} className="p-4 border rounded shadow">
                            <p><strong>Booking ID:</strong> {booking._id}</p>
                            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            {/* Add more fields as needed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserBookings;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; // assuming useAuth provides token

// const UserBookingsPage = () => {
//   const { token } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get('/api/v1/users/bookings', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//        // const data = Array.isArray(res.data) ? res.data : res.data.bookings || [];
//         //setBookings(data);
//         setBookings(res.data.bookings || []);
//       } catch (err) {
//         setError('Failed to fetch bookings');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [token]);

//   if (loading) return <p>Loading your bookings...</p>;
//   if (error) return <p>{error}</p>;

//  return (
//     <div style={{ padding: '1rem' }}>
//       <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>My Bookings</h2>
//       {bookings.length === 0 ? (
//         <p>You haven’t booked any events yet.</p>
//       ) : (
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {bookings.map((booking) => (
//             <li
//               key={booking._id}
//               style={{
//                 border: '1px solid #ccc',
//                 borderRadius: '8px',
//                 marginBottom: '1rem',
//                 padding: '1rem',
//               }}
//             >
//               {booking.event?.image && (
//                 <img
//                   src={booking.event.image}
//                   alt={booking.event.title}
//                   style={{
//                     width: '100%',
//                     maxHeight: '200px',
//                     objectFit: 'cover',
//                     borderRadius: '6px',
//                     marginBottom: '0.5rem',
//                   }}
//                 />
//               )}
//               <p><strong>Event:</strong> {booking.event?.title || 'N/A'}</p>
//               <p><strong>Date:</strong> {booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleString() : 'N/A'}</p>
//               <p><strong>Location:</strong> {booking.event?.location || 'N/A'}</p>
//               <p><strong>Tickets:</strong> {booking.numberOfTickets}</p>
//               <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
//               <p><strong>Status:</strong> {booking.status}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );

// //   return (
// //     <div>
// //       <h2>My Bookings</h2>
// //       {bookings.length === 0 ? (
// //         <p>You haven’t booked any events yet.</p>
// //       ) : (
// //         <ul>
// //           {bookings.map((booking) => (
// //             <li key={booking._id}>
// //               <strong>Event:</strong> {booking.event.title} <br />
// //               <strong>Date:</strong> {new Date(booking.event.date).toLocaleDateString()} <br />
// //               <strong>Tickets:</strong> {booking.numberOfTickets}
// //               <hr />
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// };

// export default UserBookingsPage;
