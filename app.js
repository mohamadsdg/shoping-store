const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoute = require("./routes/feed");

// someMidlleware
app.use(morgan("dev"));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <from>
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, DELETE");
  res.setHeader("Access-control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// route
app.use("/feed", feedRoute);

// server
mongoose
  .connect(
    "mongodb+srv://mohamad:OG2od0fkphz2FnNS@cluster0-2v2dn.mongodb.net/shop-rest?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true"
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
