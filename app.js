const express = require("express");
const app = express();
const path = require("path");

const errorController = require("./controllers/error");
const adminRouter = require("./routes/admin");
const shopRoute = require("./routes/shop");
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");

const User = require("./models/user");

// this middleware for pars body req
app.use(express.urlencoded({ extended: true }));
// this middleware for serve static file (css|js|img ...)
app.use(express.static(path.join(__dirname, "public")));

// add Themplate Engine
app.set("view engine", "pug");
app.set("views", "views");

// app.use((req, res, next) => {
//   User.findById("5e5d207ec8e558168c483ed4")
//     .then(usr => {
//       // req.user = usr;
//       req.user = new User(usr.name, usr.email, usr.cart, usr._id);
//       next();
//     })
//     .catch(err => {
//       console.log(err);
//       throw err;
//     });
// });

// add Routes
app.use(shopRoute);
app.use("/admin", adminRouter);
app.use(errorController.errorNotFound);

// mongoConnect(() => {
//   app.listen(9000);
// });

mongoose
  .connect(
    "mongodb+srv://mohamad:OG2od0fkphz2FnNS@cluster0-2v2dn.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(9000);
  })
  .catch(err => {
    throw new Error("Error on initial connection ....");
  });
