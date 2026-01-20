const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


  type: {
  type: String,
  enum: ["normal", "community", "resource", "event"], // 👈 ADD event
  default: "normal",
  },

    content: {
      type: String,
      default: "",
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },

    // ✅ FIXED FILE FIELD (OBJECT, NOT STRING)
    file: {
      url: { type: String },
      type: { type: String }, // "image" | "file"
      name: { type: String },
    },

    editedAt: {
    type: Date,
    default: null
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  
    savedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    select: false, // IMPORTANT
  },
  ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
