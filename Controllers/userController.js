const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../Models/User');
//changed the path of User to use relative path
//const User = require("C:\Users\My Lap\Documents\sem 4\Software Engneering\SE-Project\Models\User.js");

// User Registration
const registerUser = async (req, res) => {
  console.log("registerUser function triggered");
  console.log("Request body:", req.body);

  try {
    const { name, email, password, role } = req.body;

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

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile , forgetPassword};
