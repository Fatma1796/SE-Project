const express = require("express");
const {
  bookTickets,
  getBookingById,
  cancelBooking,
  getUserBookings,
} = require("../Controllers/bookingController");
const { authenticateUser, authorizeRole } = require("../Middleware/authenticationMiddleware");

const router = express.Router();


router.delete("/:id", authenticateUser, cancelBooking); // Cancel a booking
router.get("/", authenticateUser, getUserBookings); // Get all bookings for a user

module.exports = router;
