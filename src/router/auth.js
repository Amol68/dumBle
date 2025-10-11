const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("../utils/validations");

// login api
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send("Invalid Email");

    const isCorrect = await user.validatePassword(password);

    if (isCorrect) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        secure: true,
      });
      return res.send("User Login Successful");
    } else {
      return res.send("Incorrect Password");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hash,
  });

  try {
    validateSignUpData(req);
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(`Error Saving The User ${error.message}`);
  }
});

module.exports = router;
