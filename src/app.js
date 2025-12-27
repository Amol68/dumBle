require('dotenv').config();
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


connectDB()
  .then(() => {
    console.log("Database Connection Successfull");
  })
  .catch((err) => {
    console.log("Database Connection Error", err);
    console.log("Database Connection Failed");
  });

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://dumble-app.duckdns.org"],
    credentials: true,
  })
);

app.use("/api", authRoute);
app.use("/api", profileRoute);
app.use("/api", requestRoute);
app.use("/api", connectionRoute);
app.use("/api", userRoute);

// app.use("/getUserData", (req, res) => {
//   // db query & other logic
//   throw new Error();
//   res.send("user data sent");
// });

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.download();
//   }
// });
// app.get("/admin/getData",(req,res)=>{
//    res.send("Admin Response")
// })

// const fetchData = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve("API DATA FETCHED SUCCESSFULLY !!!!");
//     }, 3000);
//   });
// };

// app.use("/", async(req, res, next) => {
//   await fetchData().then((data) => {
//      console.log("Response sent",res.headersSent)

//     res.send(data);
//     console.log("Response sent",res.headersSent)

//     next();
//   });

// });

// app.use(
//   "/user/:id",
//   (req, res, next) => {
//     console.log("Req Type:", req.);

//     next();
//   },
//   (req, res) => {
//     res.send(`User ID is ${req.params.id}`);
//   }
// );

// app.use(
//   "/user/:id",
//   (req, res, next) => {
//     console.log(`Request URL ${req.originalUrl}`);
//     console.log(`Request Params ${JSON.stringify(req.params)}`)
//     next();
//   },
//   (req, res, next) => {
//     console.log(`Request Method ${req.complete}`);
//     res.send({
//       msg1:"Response 1",
//       msg2:"Response 2",
//       msg3:"Response 3"
//     });

//   }
// );
