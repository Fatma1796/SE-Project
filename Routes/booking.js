const express = require("express");
const {
  bookTickets,
  getBookingById,
  cancelBooking,
 // getUserBookings,
} = require("../Controllers/bookingController");
const { authenticateUser, authorizeRoles } = require("../Middleware/authenticationMiddleware");

const router = express.Router();


router.delete("/:id", authenticateUser, cancelBooking); 
//router.get("/", authenticateUser, getUserBookings); 

router.post("/", authenticateUser, bookTickets); 
/*
router.get("/users/bookings", 
  authenticateUser, 
  authorizeRoles("Standard User"), // ONLY Standard User allowed
  getUserBookings
);*/

//router.get("/users/bookings", authenticateUser, authorizeRoles("Standard User"), getUserBookings);
router.get("/:id", authenticateUser, getBookingById);



module.exports = router;