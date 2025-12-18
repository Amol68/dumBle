const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://amol_:GUgBkrHWMTGogo9f@carmartcluster.zj0uipz.mongodb.net/"
  );
};

module.exports = connectDB;
