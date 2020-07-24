const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
var flash = require("connect-flash");
const morgan = require("morgan");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");

const errorController = require("./controllers/error");
const adminRouter = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const User = require("./models/user");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-2v2dn.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
var csrfProtection = csrf();

/**
 * adding secure response header with Helmet
 */
app.use(helmet());

/**
 * adding compress response bodies for all request that traverse through the middleware,
 */
app.use(compression());

/**
 * this middleware for pars body req just text data
 */
app.use(express.urlencoded({ extended: true }));
// using multer for binary data
const handleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const customName = (new Date().getTime() + "-" + file.originalname).trim();
    cb(null, customName);
  },
});
const handleFileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid MimeType"));
  }
  // console.log(file);
};

app.use(
  multer({ storage: handleStorage, fileFilter: handleFileFilter }).single(
    "imageUrl"
  )
);

// this middleware for serve static file (css|js|img ...)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "shopingStore",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
// Flash messages are stored in the session
app.use(flash());

app.use((req, res, next) => {
  //  local variables scoped to the request | (available only to the views)
  res.locals.csrfToken = req.csrfToken();
  res.locals.has_login = req.session.has_login;
  next();
});

app.use((req, res, next) => {
  // throw new Error("Sync Dummy");
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error("Async Dummy");
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // throw new Error(err);
      next(err);
    });
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
/**
 * tip : synchronous places eg:("Sync Dummy") so outside of callbacks and promises you throw in error and express will detect this and execute  your next error handling middleware
 *       inside of async code (Then catch or callbacks) eg:("Async Dummy") you have to use next with an error or include it then detected by express again
 */
app.use((err, req, res, next) => {
  // console.log("app.use", err, err.stack, err.name, err.message);
  // console.log("app.use", err.name);
  // res.status(500).send("Something broke!");

  // req.flash("error500", err);
  // res.status(err.httpStatusCode).redirect("/500");

  err.name = err.name;
  err.errmsg = err.message;
  err.currentStack = err.stack;
  err.httpStatusCode = 500;
  res
    .status(500)
    .render("500", { title: "Error !", path: "/500", errorMessage: err });
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
  .catch((err) => {
    throw new Error("Error on initial connection ....");
  });
