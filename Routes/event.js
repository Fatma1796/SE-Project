// // const express = require("express");
// // const router = express.Router();
// // const eventController = require("../Controllers/eventController");
// // const { authenticateUser, authorizeRole } = require("../Middleware/authenticationMiddleware");
// const express = require("express");
// const eventController = require("../Controllers/eventController"); // Import the event controller{
//  const{
//      getAllEvents,
//   getEventById,
//   createEvent,
//   updateEvent,
//   deleteEvent,
//   getEventAnalytics,
//   updateEventStatus,
// } = require("../Controllers/eventController");
// const { authenticateUser, authorizeRole } = require("../Middleware/authenticationMiddleware");
// const router = express.Router(); // Initialize the router object

// // Public routes
// router.get("/", eventController.getAllEvents);
// router.get("/:id", eventController.getEventById);

// // Organizer-only routes
// router.post("/", authenticateUser, authorizeRole("Organizer"), eventController.createEvent);
// router.put("/:id", authenticateUser, authorizeRole("organizer"), eventController.updateEvent);
// router.delete("/:id", authenticateUser, authorizeRole("organizer"), eventController.deleteEvent);
// router.get("/organizer/analytics", authenticateUser, authorizeRole("organizer"), eventController.getEventAnalytics);

// // Admin-only route
// router.put("/:id/status", authenticateUser, authorizeRole("admin"), eventController.updateEventStatus);



const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  updateEventStatus,
} = require("../Controllers/eventController"); // Destructure methods from eventController
const { authenticateUser, authorizeRoles } = require("../Middleware/authenticationMiddleware");

const router = express.Router(); // Initialize the router object

// Public routes
router.get("/", getAllEvents); // Get all approved events
router.get("/:id", getEventById); // Get event by ID

// Organizer-only routes
router.post("/", authenticateUser, authorizeRoles("Organizer"), createEvent); // Create a new event

router.get(
  "/organizer/analytics",
  authenticateUser,
  authorizeRoles("Organizer"),
  getEventAnalytics
); // Get analytics for organizer's events

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
module.exports = router; // Export the router