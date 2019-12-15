const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./util/database");
const Product = require("./models/products");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Order = require("./models/order");
const OrderItem = require("./models/order_item");

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

Cart.belongsTo(User);
User.hasOne(Cart);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true })
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
    // becuse need for mock Cart for user
    Cart.findAndCount()
      .then(result => {
        return result.count === 0 && user.createCart();
      })
      .catch(err => {
        console.log(err);
      });
  })
  .then(cart => {
    // console.log(user);
    app.listen(9000);
  })
  .catch(err => {
    console.log(err);
  });
