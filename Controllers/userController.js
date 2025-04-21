const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../Models/User');
const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

//changed the path of User to use relative path
//const User = require("C:\Users\My Lap\Documents\sem 4\Software Engneering\SE-Project\Models\User.js");

// User Registration
const registerUser = async (req, res) => {
  console.log("registerUser function triggered");
  console.log("Request body:", req.body);

  try {
    const { name, email, password, role } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: "Invalid email address" });
        }
    
        // Validate role
        const allowedRoles = ["Standard User", "Organizer", "System Admin"];
        if (!allowedRoles.includes(role)) {
          return res.status(400).json({ message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}` });
        }

    // Check if user already exists
    console.log("Checking if user exists");
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    console.log("Creating new user");
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("Saving new user");
await newUser.save(); // Save the user to the database
res.status(201).json({
  message: "User registered successfully",
});

  } catch (error) {
    console.error("Error in registerUser:", error.message, error.stack);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};;




const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Inside loginUser function");

    // Validate input
    if (!email || !password) {
      console.error("Email or password is missing");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email
    console.log("Finding user by email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("User found:", user);

    // Compare passwords
    console.log("Comparing passwords");
    if (!password || !user.password) {
      console.error("Password or user password is missing");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("Password matched");

    console.log("Updating lastLogin field for user");
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    console.log("Generating JWT token");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "defaultSecretKey", // Fallback value
      { expiresIn: "1h" }
    );

    // Set the token in a cookie
    console.log("Setting token in cookie");
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    console.log("Login successful");
  } catch (error) {
    console.error("Error during login:", error.message, error.stack);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};


/* // User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } */

/*     // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
}; */



// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // The user is added by the authenticateUser middleware
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || "No profile picture",
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch profile, please try again later" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { name, email, profilePicture } = req.body;
  const user = req.user; // The user is added by the authenticateUser middleware

  try {
    // Validate input
    if (!name && !email && !profilePicture) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    // Update user profile
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Unable to update profile, please try again later" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users");

    // Fetch all users from the database
    const users = await User.find({}, "-password"); // Exclude the password field for security
    console.log("Users fetched successfully:", users);

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message, error.stack);
    res.status(500).json({ message: "Failed to fetch users, please try again later" });
  }
};


// const updateUserProfile = async (req, res) => {
//   const { name, email, profilePicture } = req.body;
//   const user = req.user; // The user is added by the authenticateUser middleware

//   try {
//     // Update user profile
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (profilePicture) user.profilePicture = profilePicture;

//     // Save the updated user
//     await user.save();

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         profilePicture: user.profilePicture,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Unable to update profile, please try again later" });
//   }
// };

// Forgoted password

const forgetPassword = async (req, res) => {
  console.log("forgetPassword function triggered");
  const { email, newPassword } = req.body;

  try {
    console.log("Validating input");
    if (!email || !newPassword) {
      console.log("Validation failed: Missing email or newPassword");
      return res.status(400).json({ message: "Email and new password are required" });
    }

    console.log("Checking if user exists");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Hashing new password");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log("Updating user password");
    user.password = hashedPassword;

    try {
      await user.save();
      console.log("Password updated successfully");
      res.status(200).json({ message: "Password updated successfully" });
    } catch (saveError) {
      console.error("Error saving updated password:", saveError.message);
      return res.status(500).json({ message: "Failed to update password, please try again later" });
    }
  } catch (error) {
    console.error("Error in forgetPassword:", error.message, error.stack);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// the details of  asingle user 
const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user without password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `${user.name} details fetched successfully`,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Define allowed roles
    const allowedRoles = ["Standard User", "Organizer", "System Admin"];

    // Validate incoming role
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `${updatedUser.name}'s role updated to ${updatedUser.role}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error.message);
    res.status(500).json({ message: "Failed to update user role" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: `User ${user.name} deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};


// const updateUserRole = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { role } = req.body;

//     // Optional: Validate allowed roles
//     const allowedRoles = ["Standard User", "Event Organizer", "System Admin"];
//     if (!allowedRoles.includes(role)) {
//       return res.status(400).json({ message: "Invalid role specified" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { role },
//       { new: true, runValidators: true }
//     ).select("-password");

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: `${updatedUser.name}'s role updated to ${updatedUser.role}`,
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error updating user role:", error.message);
//     res.status(500).json({ message: "Failed to update user role" });
//   }
// };

// const getEventsForCurrentUser = async (req, res) => {
//   console.log("Inside getEventsForCurrentUser"); // This should print when the route is hit
//   try {
//     console.log("Authenticated user:", req.user); // Log authenticated user to check the _id

//     // Check if the user is authenticated and has an ID
//     if (!req.user || !req.user._id) {
//       return res.status(400).json({ message: "User authentication failed or missing user ID" });
//     }

//     // Ensure the logged-in user is an organizer
//     if (req.user.role !== "Organizer") {
//       return res.status(403).json({ message: "Access denied. Only organizers can access this resource." });
//     }

//     console.log("Authenticated Organizer ID:", req.user._id); // Log the organizer's ID

//     // Find the last logged-in Standard User
//     const lastLoggedInUser = await User.findOne({ role: "Standard User" }).sort({ lastLogin:-1 });
//     console.log("Last Logged In User:", lastLoggedInUser); // Log the last logged-in user

//     if (!lastLoggedInUser) {
//       return res.status(404).json({ message: "No standard users found" });
//     }

//     const userId = lastLoggedInUser._id; // Get the last logged-in user's ID
//     console.log("Last Logged In User ID:", userId); // Log the userId being used

//     // Get all bookings for the specified Standard User
//     const bookings = await Booking.find({ user: userId }).populate("event");
//     console.log("Bookings:", bookings); // Log the bookings found for the user

//     if (bookings.length === 0) {
//       return res.status(404).json({ message: "No events found for this user" });
//     }

//     // Prepare event data for all bookings
//     const eventData = bookings.map(booking => {
//       const event = booking.event;
//       return {
//         eventId: event._id,
//         title: event.title,
//         description: event.description,
//         eventDate: event.eventDate,
//         location: event.location,
//         category: event.category,
//         totalTickets: event.totalTickets,
//         remainingTickets: event.remainingTickets,
//         status: event.status,
//         organizer: event.organizer // Include the organizer of the event
//       };
//     });

//     console.log("Event Data:", eventData); // Log the event data

//     res.status(200).json({ events: eventData });
//   } catch (error) {
//     console.error("Error in getEventsForCurrentUser:", error.message);
//     res.status(500).json({ message: "Failed to get events for the current user" });
//   }
// };
//nst Event = require("../Models/Event");

const getEventsForCurrentUser = async (req, res) => {
  console.log("Inside getEventsForCurrentUser");

  try {
    console.log("Authenticated user:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: "User authentication failed or missing user ID" });
    }

    if (req.user.role !== "Organizer") {
      return res.status(403).json({ message: "Access denied. Only organizers can access this resource." });
    }

    console.log("Authenticated Organizer ID:", req.user._id);

    const events = await Event.find({ organizer: req.user._id });

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for this organizer" });
    }

    const eventData = events.map(event => ({
      eventId: event._id,
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      location: event.location,
      category: event.category,
      totalTickets: event.totalTickets,
      remainingTickets: event.remainingTickets,
      status: event.status
    }));

    console.log("Event Data:", eventData);

    res.status(200).json({ events: eventData });

  } catch (error) {
    console.error("Error in getEventsForCurrentUser:", error);
    res.status(500).json({ message: "Failed to get events for the current organizer", error: error.message });
  }
};

module.exports = { getEventsForCurrentUser };


// Get current user's bookings
const getCurrentUserBookings = async (req, res) => {
  try {
    console.log("Authenticated user ID:", req.user._id); // Debugging log
    console.log("Authenticated user role:", req.user.role); // Debugging log

    const bookings = await Booking.find({ user: req.user._id }).populate("event");
    console.log("User bookings:", bookings); // Debugging log

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getCurrentUserBookings:", error.message);
    res.status(500).json({ message: error.message || "An error occurred while fetching bookings" });
  }
};


module.exports = { 
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgetPassword, 
  getAllUsers,
  getSingleUser,
  updateUserRole,
  getEventsForCurrentUser,
deleteUser,
getCurrentUserBookings,
};
