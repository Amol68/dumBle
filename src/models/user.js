const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      validate(email) {
        if (!validator.isEmail(email)) throw new Error("Invalid Email");
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Minimum 8 characters"],
    },
    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: `{Value} Invalid Gender type`,
      },
    },

    about: {
      type: String,
     // default: "This is about me",
    },
    photoUrl: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ id: user._id }, "DEV$Tinder@123", {
    expiresIn: "1h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (userPassword) {
  const user = this;

  const isValid = await bcrypt.compare(userPassword, user.password);
  return isValid;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
