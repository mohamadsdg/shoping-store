const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");

// this middleware for pars body req
app.use(express.urlencoded({ extended: true }));

// this middleware for serve static file (css|js|img ...)
app.use(express.static(path.join(__dirname, "public")));

// add template engin
app.set("view engine", "pug");
app.set("views", "views");

app.use(shopRoute);
// add filtering mecanism
app.use("/admin", adminData.route);

app.use((req, res, next) => {
  // res.status(404).send("<h1>Page not Found</h1>");
  res.sendFile(path.join(__dirname, "views", "404.html"));
});
// const server = http.createServer(app);
app.listen(9222);
