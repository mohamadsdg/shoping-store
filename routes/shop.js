const express = require("express");
const route = express.Router();
const path = require("path");
const rootDir = require("../util/path");
const adminData = require("./admin");

route.get("/", (req, res, next) => {
  // res.send("<h1>first page</h1>");
  // res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  // console.log("product", adminData.product);
  res.render("shop", { data: adminData.product, title: "SHOP", path: "/" });
});

module.exports = route;
