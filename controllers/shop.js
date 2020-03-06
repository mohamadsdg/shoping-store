const Product = require("../models/products");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  // #mongoose
  // using built-in middleware API (find) mongoose for fetch-all document
  Product.find()
    .then(product => {
      res.render("shop/index", {
        data: product,
        title: "SHOP",
        path: "/"
      });
    })
    .catch(err => {
      console.log(err);
    });

  // #mongoo
  //   Product.findAll()
  //     .then(product => {
  //       res.render("shop/index", {
  //         data: product,
  //         title: "SHOP",
  //         path: "/"
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
};
exports.getOrders = (req, res, next) => {
  // #mongoose
  Order.find({ "user.userId": req.user })
    .then(order => {
      console.log("order", order[0].products[0].product);
      res.render("shop/orders", {
        title: "Order Page",
        path: "/orders",
        data: order
      });
    })
    .catch(err => {
      console.log(err);
    });
  // #mongo
  // req.user
  //   .getOrders()
  //   .then(order => {
  //     // console.log("order", order);
  //     res.render("shop/orders", {
  //       title: "Order Page",
  //       path: "/orders",
  //       data: order
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
exports.postOrders = (req, res, next) => {
  // #mongoose
  req.user
    .addOrder()
    .then(result => {
      const order = new Order({
        products: result.products,
        user: result.user
      });
      return order.save();
    })
    .then(() => res.redirect("/orders"))
    .catch(err => {
      throw err;
    });

  // #mongoo
  // req.user
  //   .addOrder()
  //   .then(() => {
  //     res.redirect("/orders");
  //   })
  //   .catch(err => {});
};
exports.getProducts = (req, res, next) => {
  // # mongoose
  // using built-in middleware API (find) mongoose for fetch-all document
  Product.find()
    .then(product => {
      res.render("shop/index", {
        data: product,
        title: "Products List Page",
        path: "/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
  // #mongoo
  // Product.findAll()
  //   .then(product => {
  //     res.render("shop/index", {
  //       data: product,
  //       title: "Products List Page",
  //       path: "/products"
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // #mongoose
  // using built-in middleware API (findById) mongoose for fetch-single document
  // auto convert string to ObjectId type in mongodb
  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product,
        title: product.title,
        path: "/products"
      });
    })
    .catch(err => {
      console.log("getProduct", err);
      res.status("404").send("<h1>Product not found</h1>");
    });
  // #mongo
  // Product.findById(prodId)
  //   .then(product => {
  //     res.render("shop/product-detail", {
  //       product: product, //product[0] when using toArray()
  //       title: product.title, //product[0].title
  //       path: "/products"
  //     });
  //   })
  //   .catch(err => {
  //     console.log("getProduct", err);
  //     res.status("404").send("<h1>Product not found</h1>");
  //   });
};
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate() //If specified, a promise will not be returned
    .then(user => {
      // console.log(user.cart.items);
      res.render("shop/cart", {
        title: "Cart Page",
        path: "/cart",
        data: user.cart.items
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      // console.log(product);
      return req.user.addToCart(product);
    })
    .then(result => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch(err => {
      console.log(err);
      throw err;
    });

  // User.addToCart(prodId)
  //   .then(result => {
  //     // console.log("result cart ======>", result);
  //     res.redirect("/cart");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // res.redirect("/");
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout Page",
    path: "/checkout"
  });
};
