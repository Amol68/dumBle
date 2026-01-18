const express = require("express");
const instance = require("../utils/razorpay");
const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const router = express.Router();

router.post("/payment/create", userAuth, async (req, res) => {
  const { firstName, lastName, emailId } = req.user;
  const { membershipType } = req.body;

  try {
    const order = await instance.orders.create({
      amount: membershipAmount[membershipType] * 1000,
      currency: "INR",
      receipt: "Receipt#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      userId: req?.user?._id,
      orderId: order?.id,
      status: order?.status,
      amount: order?.amount,
      currency: order?.currency,
      receipt: order?.receipt,
      notes: order?.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/payment/webhook", async (req, res) => {
  const webhookSignature = req.get("X-Razorpay-Signature");
  try {
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid)
      res.status(400).json({ msg: "webhook signature is not valid" });

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.premium = true;
    user.memberShipType = payment.notes.memberShipType;
    await user.save();
    if (req.body.event === "payment.captured") {
    }

    if (req.body.event === "payment.failed") {
    }
    res.status(200).json({ msg: "webhook received successfully" });
  } catch (error) {
    console.log({ error });
  }
});

module.exports = router;
