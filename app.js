const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
var flash = require("connect-flash");
const morgan = require("morgan");

const errorController = require("./controllers/error");
const adminRouter = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://mohamad:OG2od0fkphz2FnNS@cluster0-2v2dn.mongodb.net/shop?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
var csrfProtection = csrf();

// this middleware for pars body req
app.use(express.urlencoded({ extended: true }));
// this middleware for serve static file (css|js|img ...)
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "shopingStore",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
// Flash messages are stored in the session
app.use(flash());

app.use((req, res, next) => {
  // throw new Error('Dummy')
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  //  local variables scoped to the request | (available only to the views)
  res.locals.csrfToken = req.csrfToken();
  res.locals.has_login = req.session.has_login;
  next();
});

app.use(morgan("dev"));

// add Themplate Engine
app.set("view engine", "pug");
app.set("views", "views");

// app.use((req, res, next) => {
//   User.findById("5e60b7e821b1da2de43511be")
//     .then(usr => {
//       req.user = usr;
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
app.use(authRoute);
app.get("/500", errorController.error500);
app.use(errorController.errorNotFound);

// Error handle
app.use((err, req, res, next) => {
  // console.log("app.use", err, err.stack, err.name, err.message);
  // console.log("app.use", err.name);
  // res.status(500).send("Something broke!");
  req.flash("error500", err);
  res.status(err.httpStatusCode).redirect("/500");
});

// #mongo
// mongoConnect(() => {
//   app.listen(9000);
// });

// #mongoose
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(9000);
  })
  .catch(err => {
    throw new Error("Error on initial connection ....");
  });
