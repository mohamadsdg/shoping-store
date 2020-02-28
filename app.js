const express = require("express");
const app = express();
const path = require("path");

const errorController = require("./controllers/error");
const adminRouter = require("./routes/admin");
// const shopRoute = require("./routes/shop");
const mongoConnect = require("./util/database").mongoConnect;

// this middleware for pars body req
app.use(express.urlencoded({ extended: true }));
// this middleware for serve static file (css|js|img ...)
app.use(express.static(path.join(__dirname, "public")));

// add Themplate Engine
app.set("view engine", "pug");
app.set("views", "views");

// add Routes
// app.use(shopRoute);
app.use("/admin", adminRouter);
app.use(errorController.errorNotFound);

mongoConnect(() => {
  app.listen(9000);
});
