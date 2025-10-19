const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { route } = require("./connection");
const User = require("../models/user");

const router = express.Router();

router.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) res.send("User not logged in");

    const connectionRequests = await ConnectionRequest.find({
      toUserID: user._id,

      status: "interested",
    }).populate("fromUserID", ["firstName", "lastName"]);

    res.json({
      message: "Requests Fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) res.send("Please log in first");

    const connections = await ConnectionRequest.find({
      $or: [
        {
          toUserID: user._id,
          status: "accepted",
        },
        {
          fromUserID: user._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserID", ["firstName", "lastName"])
      .populate("toUserID", ["firstName", "lastName"]);

    const data = connections.map((connection) => {
      if (connection.fromUserID._id.toString() === user._id.toString()) {
        return connection.toUserId;
      } else {
        return connection.fromUserID;
      }
    });

    res.status(200).json({
      message: "Connections fetched Successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) res.send("Please log in first");

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserID: user._id }, { toUserID: user._id }],
    }).select(["fromUserID", "toUserID"]);

    const hideUsers = new Set();

    connectionRequests.forEach((req) => {
      hideUsers.add(req.fromUserID.toString());
      hideUsers.add(req.toUserID.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(["firstName", "lastName", "about", "photoUrl", "skills"])
      .skip(page - 1 * 5)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
