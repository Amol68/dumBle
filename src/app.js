const express = require("express");
const connectDB = require("./config/database");
const authRoute = require("./router/auth");
const profileRoute = require("./router/profile");
const requestRoute = require("./router/request");
const connectionRoute = require("./router/connection");
const userRoute = require("./router/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;

connectDB()
  .then(() => {
    console.log("Database Connection Successfull");
  })
  .catch((err) => {
    console.log("Database Connection Failed");
  });

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/", requestRoute);
app.use("/", connectionRoute);
app.use("/", userRoute);
