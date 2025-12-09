const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {

    console.log("api hit")
    const loggedInUser = req.user;

    if (!loggedInUser) return res.send({ message: "Please login first" });
    const status = req.params.status;

    const allowedStatus = ["rejected", "accepted"];

    if (!allowedStatus.includes(status.trim())) {
      return res.status(401).send({ message: "Invalid Status" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: req.params.requestId,
      toUserID: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      res.status(400).send({
        message: "Request Not Found",
      });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.status(200).json({
      message: "Response sent successfully",
      data: data,
    });
  }
);

module.exports = router;
