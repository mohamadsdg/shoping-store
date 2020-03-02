const Product = require("../models/products");
const User = require("../models/user");
// const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
};
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then(order => {
      console.log(order);
      res.render("shop/orders", {
        title: "Order Page",
        path: "/orders",
        data: order
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postOrders = (req, res, next) => {
  let _cart;
  req.user
    .getCart()
    .then(cart => {
      _cart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => {
          console.log(err);
        });
    })
    .then(resualt => {
      // drop all product from cart after set to order
      return _cart.setProducts(null);
    })
    .then(resualt => {
      res.redirect("/orders");
    })
    .catch(err => {});
};
exports.getProducts = (req, res, next) => {
  Product.findAll()
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
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product, //product[0] when using toArray()
        title: product.title, //product[0].title
        path: "/products"
      });
    })
    .catch(err => {
      console.log("getProduct", err);
      res.status("404").send("<h1>Product not found</h1>");
    });
};
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(product => {
      res.render("shop/cart", {
        title: "Cart Page",
        path: "/cart",
        data: product
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => req.user.addToCart(product))
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
