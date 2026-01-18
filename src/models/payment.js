const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },

    orderId: {
      type: String,
      required: true,
    },

    paymentId: {
      type: String,
    },

    amount: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    receipt: {
      type: String,
      required: true,
    },

    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
