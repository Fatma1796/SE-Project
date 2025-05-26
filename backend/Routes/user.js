const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  forgetPassword,
  getAllUsers,
 
  updateUserRole,
  getEventsForCurrentUser,
  deleteUser,
  getCurrentUserBookings,
  getSingleUser,
  logoutUser
} = require("../Controllers/userController");
const { authenticateUser, authorizeRoles } = require("../Middleware/authenticationMiddleware");

const router = express.Router();

// User registration
router.post("/register", registerUser);
// Test route for debugging
// router.post("/register", (req, res) => {
//   console.log("Request received at /register");
//   res.status(200).json({ message: "Test route working" });
// });

// User login
router.post("/login", loginUser);

// Forgot password
//router.route("/forgetPassword").post(forgotOrResetPassword).put(forgotOrResetPassword);

// Get user profile (requires authentication)
router.get("/profile", authenticateUser, getUserProfile);

// Update user profile (requires authentication)
router.put("/profile", authenticateUser, updateUserProfile);

router.post('/logout', logoutUser);

// Admin-only route (requires 'System Admin' role)
router.get("/admin-dashboard", authenticateUser, authorizeRoles("System Admin"), (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard" });
});

// Organizer route (requires 'Organizer' or 'System Admin' role)
router.get("/organizer-dashboard", authenticateUser, authorizeRoles("Organizer", "System Admin"), (req, res) => {
  res.status(200).json({ message: "Welcome to the organizer dashboard" });
});

// Update user profile (requires authentication)
router.get("/", authenticateUser, authorizeRoles("System Admin"), getAllUsers);

// Forgot password
router.put("/forgetPassword", forgetPassword);

router.get(
  '/events', (req, res, next) => {
    console.log("Route '/users/events' hit");next(); }, authenticateUser, // Authenticate the user
 authorizeRoles("Organizer"), // Authorize the user as Organizer
  getEventsForCurrentUser ,// Controller function
);


router.get("/bookings", (req, res, next) => {
  console.log("GET /api/v1/users/bookings hit");
  next();
}, authenticateUser, getCurrentUserBookings);


// router.put("/forgetPassword", (req, res, next) => {
//   console.log("Request received at /forgetPassword");
//   next();
// }, forgetPassword);

// User profile (accessible to all logged-in users)
// router.get("/profile", authenticateUser, (req, res) => {
//   res.status(200).json(req.user);
// });

//const { getSingleUser } = require("../Controllers/userController"); // Add this to your import

// Get single user (admin only)
router.get("/:id", authenticateUser, authorizeRoles("System Admin"), getSingleUser);


// update user role (admin only)
router.put("/:id", authenticateUser, authorizeRoles("System Admin"), updateUserRole);


//deleting a user (admin only)
router.delete("/:id", authenticateUser, authorizeRoles("System Admin"), deleteUser);

// router.get(
//   '/events', (req, res, next) => {
//     console.log("Route '/users/events' hit");next(); }, authenticateUser, // Authenticate the user
//  authorizeRoles("Organizer"), // Authorize the user as Organizer
//   getEventsForCurrentUser ,// Controller function
// );



module.exports = router;