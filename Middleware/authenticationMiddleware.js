

const jwt = require("jsonwebtoken");
const User = require("../Models/User");



const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // Fetch user from the database
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach the full user object to req.user
    console.log("Authenticated user:", req.user); // Debugging log
    next();
  } catch (err) {
    console.error("Error in authenticateUser middleware:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("Role Authorization middleware triggered"); // Log role authorization

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };

