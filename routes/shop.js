const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path");

route.get("/", (req, res, next) => {
  // res.send("<h1>first page</h1>");
  // res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = route;
