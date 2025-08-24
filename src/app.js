const express = require("express");

const app = express();
const port = 3000;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/",(req, res) => {
  res.send("request handled default");
});


app.use("/test",(req,res)=>{
  res.send("request handled on test");
})




