const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String, // URL of the profile picture
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Standard User", "Organizer", "System Admin"],
      required: true,
    },

   lastLogin: { type: Date }
  },
  { timestamps: true } // Automatically adds "createdAt" and "updatedAt"

);

module.exports = mongoose.model("User", userSchema);

//console.log("Hello World") // can be removed, just to check if the file is being executed
