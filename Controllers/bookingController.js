
const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const event = await Event.findById(booking.event);
    if (event) {
      console.log("Event found:", event);
      event.remainingTickets += booking.numberOfTickets;
      await event.save();
      console.log("Updated remainingTickets:", event.remainingTickets);
    } else {
      console.log("Event not found for booking.");
    }

    await booking.deleteOne();
    res.status(200).json({ message: "Booking cancelled successfully" });

  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: error.message || "An error occurred while canceling the booking" });
  }
};


// const cancelBooking = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id);
//       if (!booking) {
//         return res.status(404).json({ message: "Booking not found" });
//       }
  
//       // Find the event and update available tickets
//       const event = await Event.findById(booking.eventId);
//       if (event) {
//         event.availableTickets += booking.ticketsBooked;
//         await event.save();
//       }
  
//       // Delete the booking
//       await booking.deleteOne();
//       res.status(200).json({ message: "Booking cancelled successfully" });
//     } catch (error) {
//       res.status(500).json({ message: error.message || "An error occurred while canceling the booking" });
//     }
//   };
  
  /*// Get all bookings for the current user
  const getUserBookings = async (req, res) => {
    try {
      console.log("Authenticated user ID:", req.user.id);
  
      const bookings = await Booking.find({ user: req.user.id }).populate("event");
      console.log("User bookings:", bookings);
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user" });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error in getUserBookings:", error.message);
      res.status(500).json({ message: error.message || "An error occurred while fetching bookings" });
    }
  };
  */
/*
  const getUserBookings = async (req, res) => {
  try {
    console.log("Authenticated user ID:", req.user._id); // Debugging log
    console.log("Authenticated user role:", req.user.role); // Debugging log

    const bookings = await Booking.find({ user: req.user._id }).populate("event");
    console.log("User bookings:", bookings); // Debugging log

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getUserBookings:", error.message);
    res.status(500).json({ message: error.message || "An error occurred while fetching bookings" });
  }
};*/

// Book tickets for an event
const bookTickets = async (req, res) => {
  try {
    const { eventId, ticketsBooked } = req.body;
    const userId = req.user.id;

    console.log("Request body:", req.body);
    console.log("Authenticated user ID:", userId);

    if (!eventId || !ticketsBooked) {
      return res.status(400).json({ message: "Event ID and ticketsBooked are required" });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (event.status !== "approved") {
      return res.status(400).json({ message: "Bookings can only be made for approved events" });
       }
    console.log("Event found:", event);

    // Check ticket availability
    if (event.remainingTickets < ticketsBooked) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Calculate total price using the correct field name
    const totalPrice = ticketsBooked * event.ticketPrice;
    console.log("Total price calculated:", totalPrice);

    // Create booking
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      numberOfTickets: ticketsBooked,
      totalPrice,
    });

    console.log("Booking created:", booking);

    // Update event's remaining tickets
    event.remainingTickets -= ticketsBooked;
    await event.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Error in bookTickets:", error.message);
    res.status(500).json({ message: error.message || "An error occurred while booking tickets" });
  }
};
// const bookTickets = async (req, res) => {
//   try {
//     const { eventId, ticketsBooked } = req.body;
//     const userId = req.user.id;

//     if (!eventId || !ticketsBooked) {
//       return res.status(400).json({ message: "Event ID and ticketsBooked are required" });
//     }

//     // Find the event
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // Check ticket availability
//     if (event.availableTickets < ticketsBooked) {
//       return res.status(400).json({ message: "Not enough tickets available" });
//     }

//     // Calculate total price
//     const totalPrice = ticketsBooked * event.price;

//     // Create booking
//     const booking = await Booking.create({
//       userId,
//       eventId,
//       ticketsBooked,
//       totalPrice,
//     });

//     // Update event's available tickets
//     event.availableTickets -= ticketsBooked;
//     await event.save();

//     res.status(201).json({ message: "Booking successful", booking });
//   } catch (error) {
//     res.status(500).json({ message: error.message || "An error occurred while booking tickets" });
//   }
// };

// Get booking details by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event"); // Use "event" instead of "eventId"
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || "An error occurred while fetching the booking" });
  }
};

module.exports = {
    bookTickets,
    getBookingById,
    cancelBooking,
    //getUserBookings,
  };