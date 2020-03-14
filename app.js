const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

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

// add Themplate Engine
app.set("view engine", "pug");
app.set("views", "views");

app.use((req, res, next) => {
  User.findById("5e60b7e821b1da2de43511be")
    .then(usr => {
      req.user = usr;
      next();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

// add Routes
app.use(shopRoute);
app.use("/admin", adminRouter);
app.use(authRoute);
app.use(errorController.errorNotFound);

// #mongo
// mongoConnect(() => {
//   app.listen(9000);
// });

// #mongoose
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        user = new User({
          name: "MohamadReza",
          email: "sdg@dev.com",
          cart: { items: [] }
        });
        user.save();
      }
    });
    app.listen(9000);
  })
  .catch(err => {
    throw new Error("Error on initial connection ....");
  });
