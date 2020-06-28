const express = require("express");
const app = express();
const morgan = require("morgan");
var bodyParser = require("body-parser");

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
app.listen(8080);
