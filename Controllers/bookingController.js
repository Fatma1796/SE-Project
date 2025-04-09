const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

// Cancel a booking
const cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Find the event and update available tickets
      const event = await Event.findById(booking.eventId);
      if (event) {
        event.availableTickets += booking.ticketsBooked;
        await event.save();
      }
  
      // Delete the booking
      await booking.deleteOne();
      res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "An error occurred while canceling the booking" });
    }
  };
  
  // Get all bookings for the current user
  const getUserBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.user.id }).populate("eventId");
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user" });
      }
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message || "An error occurred while fetching bookings" });
    }
  };
  
  module.exports = {
    bookTickets,
    getBookingById,
    cancelBooking,
    getUserBookings,
  };
  
  
