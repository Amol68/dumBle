const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Minimum 6 characters"],
      maxLength: [15, "Maximum 15 characters"],
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(val) {
        if (!["Male", "Female", "Other"].includes(val)) {
          throw new Error("Gender not allowed");
        }
      },
    },
    about: {
      type: String,
      default: "This is about me",
    },
    photoUrl: {
      type: String,
      default: "www.dummyimage.com",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
