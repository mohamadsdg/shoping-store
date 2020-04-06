const fs = require("fs");
const path = require("path");
const Product = require("../models/products");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  // #mongoose
  // using built-in middleware API (find) mongoose for fetch-all document
  Product.find()
    .then((product) => {
      res.render("shop/index", {
        data: product,
        title: "SHOP",
        path: "/",
      });
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.getOrders = (req, res, next) => {
  // #mongoose
  Order.find({ "user.userId": req.user })
    .then((order) => {
      // console.log("order", order[0].products[0].product);
      res.render("shop/orders", {
        title: "Order Page",
        path: "/orders",
        data: order,
      });
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.postOrders = (req, res, next) => {
  // #mongoose
  req.user
    .addOrder()
    .then((result) => {
      const order = new Order({
        products: result.products,
        user: result.user,
      });
      return order.save();
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.getProducts = (req, res, next) => {
  // # mongoose
  // using built-in middleware API (find) mongoose for fetch-all document
  Product.find()
    .then((product) => {
      res.render("shop/index", {
        data: product,
        title: "Products List Page",
        path: "/products",
      });
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // #mongoose
  // using built-in middleware API (findById) mongoose for fetch-single document
  // auto convert string to ObjectId type in mongodb
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        title: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
      // console.log("getProduct", err);
      // res.status("404").send("<h1>Product not found</h1>");
    });
};
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate() //If specified, a promise will not be returned
    .then((user) => {
      // console.log(user.cart.items);
      res.render("shop/cart", {
        title: "Cart Page",
        path: "/cart",
        data: user.cart.items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      // console.log(product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout Page",
    path: "/checkout",
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoicesName = "invoice-" + orderId + ".pdf";
  const pathFile = path.join("data", "invoices", invoicesName);

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("order not Found !"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("unauthorize"));
      }
      fs.readFile(pathFile, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader("content-type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + invoicesName
        );
        res.send(data);
      });
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
