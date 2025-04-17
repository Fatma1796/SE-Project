const express = require("express");
const {
  bookTickets,
  getBookingById,
  cancelBooking,
  getUserBookings,
} = require("../Controllers/bookingController");
const { authenticateUser, authorizeRole } = require("../Middleware/authenticationMiddleware");

const router = express.Router();


router.delete("/:id", authenticateUser, cancelBooking); 
router.get("/", authenticateUser, getUserBookings); 

router.post("/", authenticateUser, bookTickets); 
router.get("/:id", authenticateUser, getBookingById); 

module.exports = router;