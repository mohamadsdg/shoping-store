const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

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
app.use("/images", express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname.trim());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "images/png" ||
    file.mimetype == "images/jpg" ||
    file.mimetype == "images/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
// route
app.use("/feed", feedRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.payload || {};
  res.status(status).json({ message: message, data: data });
});

// server
mongoose
  .connect(
    "mongodb+srv://mohamad:OG2od0fkphz2FnNS@cluster0-2v2dn.mongodb.net/shop-rest?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true"
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    throw new Error("Error on initial connection ....");
  });
