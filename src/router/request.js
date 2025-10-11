const express = require("express");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/sendconnectionrequest", userAuth, async (req, res) => {
  console.log("Send connection request");
  res.send("connection request");
});


module.exports = router;