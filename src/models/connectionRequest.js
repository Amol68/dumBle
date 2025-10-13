const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{Value} Invalid Status type`,
      },
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

//connectionRequestSchema.index({fromUserID:1});

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
    throw new Error("Cannot Send Connection Request To Self");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

ConnectionRequest.syncIndexes();

module.exports = ConnectionRequest;
