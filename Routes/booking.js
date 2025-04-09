const express = require("express");
const {
  bookTickets,
  getBookingById,
  cancelBooking,
  getUserBookings,
} = require("../Controllers/bookingController");
const { authenticateUser, authorizeRole } = require("../Middleware/authenticationMiddleware");

const router = express.Router();

router.post("/", authenticateUser, bookTickets); 
router.get("/:id", authenticateUser, getBookingById); 