const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../Controllers/userController");
const { authenticateUser, authorizeRoles } = require("../Middleware/authenticationMiddleware"); // Corrected path

const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Get user profile (requires authentication)
router.get("/profile", authenticateUser, getUserProfile);

// Update user profile (requires authentication)
router.put("/profile", authenticateUser, updateUserProfile);

// Admin-only route (requires 'System Admin' role)
router.get("/admin-dashboard", authenticateUser, authorizeRoles("System Admin"), (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard" });
});

// Organizer route (requires 'Organizer' or 'System Admin' role)
router.get("/organizer-dashboard", authenticateUser, authorizeRoles("Organizer", "System Admin"), (req, res) => {
  res.status(200).json({ message: "Welcome to the organizer dashboard" });
});

// User profile (accessible to all logged-in users)
router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
