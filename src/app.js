const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const User = require("./models/user");

connectDB()
  .then(() => {
    console.log("Database Connection Successfull");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed");
  });

app.use(express.json()); // global mw to convert JSON into object

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(`Error Saving The User ${error.message}`);
  }
});

// feed API: get all users from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
// feed API: get a single user from DB by email
app.get("/user", async (req, res) => {
  const userLName = req.body.lastName;

  try {
    const user = await User.findOne({ lastName: userLName });

    if (user.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("User not found");
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.id;

  try {
    const user = await User.findByIdAndDelete(id);
    res.send("User deleted successfully");
  } catch {
    res.status(400).send("User cannot be deleted");
  }
});

app.patch("/user/:userID", async (req, res) => {
  const body = req.body;
  const userID = req.params?.userID;

  const allowedFields = [
    "id",
    "firstName",
    "lastName",
    "password",
    "about",
    "gender",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(body).every((key) =>
    allowedFields.includes(key)
  );
  if (!isUpdateAllowed) res.send("Update Not Allowed");

  if (req.body.skills > 10) res.send("Too Many Skills");

  try {
    await User.findByIdAndUpdate({ _id: userID }, body, {
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(500).send("User Update Failed:" + err.message);
  }
});

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
