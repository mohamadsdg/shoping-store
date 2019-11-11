const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path");

route.get("/add-product", (req, res, next) => {
  // res.send(
  //   "<form action='/admin/product' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form>"
  // );
  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

route.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = route;
