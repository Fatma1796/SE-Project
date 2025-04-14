const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../Models/User');
//changed the path of User to use relative path
//const User = require("C:\Users\My Lap\Documents\sem 4\Software Engneering\SE-Project\Models\User.js");

// User Registration
const registerUser = async (req, res) => {
  

  try {
    const { name, email, password, role } = req.body;
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
console.log("password hashed");
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
console.log("before saving user");
    await newUser.save();
console.log("user saved");
    // Generate JWT token
    //const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully"
      // token,
      // user: {
      //   id: newUser._id,
      //   name: newUser.name,
      //   email: newUser.email,
      //   role: newUser.role,
      // },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// User Login
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
    }

    // Generate JWT token
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
};

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
    res.status(500).json({ message: "Unable to update profile, please try again later" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
