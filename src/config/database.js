const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://amol_:F12S5gqZBrL9OpEh@carmartcluster.zj0uipz.mongodb.net/"
  );
};

module.exports = connectDB;
