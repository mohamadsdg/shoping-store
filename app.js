const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoute = require("./routes/feed");
const authRoute = require("./routes/auth");

// someMidlleware
app.use(morgan("dev"));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <from>
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));

// route
app.use("/feed", feedRoute);
app.use("/auth", authRoute);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.payload || {};
  res.status(status).json({ message: message, data: data });
});

// server
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-2v2dn.mongodb.net/${process.env.MONGO_DATABASE}?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true`
  )
  .then(() => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("client coneccted");
    });
  })
  .catch((err) => {
    throw new Error("Error on initial connection ....");
  });
