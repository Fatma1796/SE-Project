const express = require("express");
const router = express.Router();
const eventController = require("../Controllers/eventController");
const { authenticateUser, authorizeRole } = require("../middleware/auth");

// Public routes
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Organizer-only routes
router.post("/", authenticateUser, authorizeRole("organizer"), eventController.createEvent);
router.put("/:id", authenticateUser, authorizeRole("organizer"), eventController.updateEvent);
router.delete("/:id", authenticateUser, authorizeRole("organizer"), eventController.deleteEvent);
router.get("/organizer/analytics", authenticateUser, authorizeRole("organizer"), eventController.getEventAnalytics);

// Admin-only route
router.put("/:id/status", authenticateUser, authorizeRole("admin"), eventController.updateEventStatus);
