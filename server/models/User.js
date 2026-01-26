// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },
    
    profilePic: {
  type: String,
  default: ""
},


    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student"
    },

    bio: { type: String, default: "" },

    department: { type: String, default: "" },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    savedPosts: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    },
    ],

  },
  {
    timestamps: true 
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
