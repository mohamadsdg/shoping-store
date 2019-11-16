const Product = require("../models/products");

exports.getIndex = (req, res, next) => {
  Product.fetchAll(product => {
    res.render("shop/index", {
      data: product,
      title: "SHOP",
      path: "/"
    });
  });
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    title: "Order Page",
    path: "/orders"
  });
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll(product => {
    res.render("shop/product-list", {
      data: product,
      title: "Products List Page",
      path: "/products"
    });
  });
};
exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    title: "Cart Page",
    path: "/cart"
  });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout Page",
    path: "/checkout"
  });
};
