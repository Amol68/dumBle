const mongoose = require("mongoose");


const connectDB = async () => {
  await mongoose.connect(process.env.CONNECT_DB);
};

module.exports = connectDB;
