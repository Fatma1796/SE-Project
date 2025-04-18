


const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEventAnalyticsForUser,
  updateEventStatus
} = require("../Controllers/eventController"); // Destructure methods from eventController
const { authenticateUser, authorizeRoles } = require("../Middleware/authenticationMiddleware");

const router = express.Router(); // Initialize the router object

// Public routes
router.get("/", getAllEvents); // Get all approved events
router.get("/:id", getEventById); // Get event by ID

// Organizer-only routes
router.post("/", authenticateUser, authorizeRoles("Organizer"), createEvent); // Create a new event

// router.get(
//   "/organizer/analytics",
//   authenticateUser,
//   authorizeRoles("Organizer"),
//   getEventAnalytics
// ); // Get analytics for organizer's events

// Admin-only route
router.put(
  "/:id/status",
  authenticateUser,
  authorizeRoles("System Admin"),
  updateEventStatus
); // Approve or reject an event
//both organizer and admin  
router.put("/:id", authenticateUser, authorizeRoles("Organizer", "System Admin"), updateEvent); // Update an event
router.delete("/:id", authenticateUser, authorizeRoles("Organizer", "System Admin"), deleteEvent); // Delete an event

// Add a log just before the route definition
router.get('/users/events/analytics', authenticateUser, authorizeRoles("Organizer"), (req, res, next) => {
  console.log("Analytics route hit!");
  next(); // Proceed to the next middleware/controller
}, getOrganizerEventAnalyticsForUser);

module.exports = router; // Export the router