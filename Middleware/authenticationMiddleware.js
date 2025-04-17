

const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Authenticate user
// exports.authenticateUser = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({ message: "Authorization token required" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };
 const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ensure the user object is populated with the role
    console.log("Authenticated user:", req.user); // Debugging log
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Role-based access control
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };



/*
// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Authorize specific roles
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { authenticateUser, authorizeRole };
*/