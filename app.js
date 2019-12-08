const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./util/database");
const Product = require("./models/products");
const User = require("./models/user");

const errorController = require("./controllers/error");
const adminRouter = require("./routes/admin");
const shopRoute = require("./routes/shop");

// store sequelize object to the request !!!!
app.use((req, res, next) => {
  User.findById(1)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// this middleware for pars body req
app.use(express.urlencoded({ extended: true }));
// this middleware for serve static file (css|js|img ...)
app.use(express.static(path.join(__dirname, "public")));

// add Themplate Engine
app.set("view engine", "pug");
app.set("views", "views");

// add Routes
app.use(shopRoute);
app.use("/admin", adminRouter);
app.use(errorController.errorNotFound);

// add associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync()
  .then(result => {
    return User.findById(1);
  })
  .then(user => {
    if (!user) {
      User.create({ name: "Mamrez", email: "sdg@test.com" });
    }
    return user;
  })
  .then(user => {
    // console.log(user);
    app.listen(9000);
  })
  .catch(err => {
    console.log(err);
  });
