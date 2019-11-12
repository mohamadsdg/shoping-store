const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path");
const product = [];

route.get("/add-product", (req, res, next) => {
  // res.send(
  //   "<form action='/admin/product' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form>"
  // );
  // res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", { title: "Add Product" });
});

route.post("/product", (req, res, next) => {
  product.push(req.body);

  res.redirect("/");
});

exports.route = route;
exports.product = product;
