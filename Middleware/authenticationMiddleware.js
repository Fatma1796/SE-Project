

const jwt = require("jsonwebtoken");
const User = require("../Models/User");


/*
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
*/

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Received token:", token); // Debugging log

    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging log

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach the user object to req.user
    console.log("Authenticated user:", req.user); // Debugging log
    next();
  } catch (err) {
    console.error("Error in authenticateUser middleware:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};
/*const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("Role Authorization middleware triggered"); // Log role authorization

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
    }
    next();
  };
};
*/
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("\n--- ROLE AUTHORIZATION DEBUG ---");
    console.log("User ID:", req.user._id);
    console.log("User Role from DB:", req.user.role);
    console.log("Required Roles:", roles);
    console.log("Request Path:", req.path);
    console.log("------------------------------\n");

    if (!req.user?.role) {
      return res.status(403).json({ message: "Access forbidden: No role specified" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access forbidden: Insufficient permissions",
        details: {
          userRole: req.user.role,
          requiredRoles: roles,
          userId: req.user._id,
          endpoint: req.path
        }
      });
    }

    next();
  };
};
module.exports = { authenticateUser, authorizeRoles };

