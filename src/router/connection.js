const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserID = req.user._id;
    const toUserID = req.params.toUserId.trim();
    const status = req.params.status;

    // check if request recipient is present in DB
    const receiverExists = await User.findOne({ _id: toUserID });
    if (!receiverExists) {
      res.status(404).send("User Not Found !!!");
    }

    // corner case for status
    if (!["interested", "ignored"].includes(status)) {
      res.status(400).send("Invalid status type");
    }

    //check if connection request exists
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserID, toUserID },
        { fromUserID: toUserID, toUserID: fromUserID },
      ],
    });
    if (existingConnectionRequest) {
      res.send("Connection Request already pending");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserID,
      toUserID,
      status,
    });
    const data = await connectionRequest.save();

    res.json({
      message: "Connection Request Saved Successfully",
      data,
    });
  } catch (err) {
    res.status(400).send(`Errorr ${err.message}`);
  }
});

module.exports = router;
