const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validations");

router.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Log Out Successfull");
});
// login api
router.post("/login", async (req, res) => {

  
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCorrect = await user.validatePassword(password);

    if (isCorrect) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      return res.json({ message: "User Login Successful", data: user });
    } else {
      return res.send("Incorrect Password");
    }
  } catch (err) {
    console.log("swjsywdkdekd",err)
    res.status(500).send("Server error", err);
  }
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, photoUrl } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hash,
    photoUrl,
  });

  // const userWithEmail = User.findOne({ email: email });

  // if (userWithEmail) res.send("User with given email already exists");

  try {
    validateSignUpData(req);
    const savedUser = await user.save();
    console.log({ savedUser });

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({ message: "Sign Up Successful", data: savedUser });
  } catch (error) {
    res.status(400).send(`Error Saving The User ${error.message}`);
  }
});

module.exports = router;
