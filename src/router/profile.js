const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const {
  validateSignUpData,
  validateProfileData,
} = require("../utils/validations");
const router = express.Router();

router.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.send("Error" + err);
    console.log({ err });
  }
});

router.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      res.status(400).send("Invalid Edit Request");
    }

    const loggedUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
    await loggedUser.save();

    res.json({
      message: "User Profile Updated Successfully",
      data: loggedUser,
    });
  } catch (err) {
    res.send("Error" + err);
  }
});

router.patch("/password", async (req, res) => {});

//  API: get a single user from DB by email
router.get("/user/view", async (req, res) => {
  const userLName = req.body.lastName;

  console.log({ userLName });

  try {
    const user = await User.findOne({ lastName: userLName });

    if (user.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("User not found");
  }
});

router.delete("/user", async (req, res) => {
  const id = req.body.id;

  try {
    const user = await User.findByIdAndDelete(id);
    res.send("User deleted successfully");
  } catch {
    res.status(400).send("User cannot be deleted");
  }
});

router.patch("/user/:userID", async (req, res) => {
  const body = req.body;
  const userID = req.params?.userID;

  try {
    validateSignUpData(req);

    const hash = await User.findByIdAndUpdate({ _id: userID }, body, {
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(500).send("User Update Failed:" + err.message);
  }
});

module.exports = router;
