const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://amol_:F12S5gqZBrL9OpEh@carmartcluster.zj0uipz.mongodb.net/"
  );
};

connectDB().then(()=>{
  console.log("Database Connection Successfull")
}).catch(err=>{
  console.log("Database Connection Failed")
})
