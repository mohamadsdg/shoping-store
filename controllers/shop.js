const Product = require("../models/products");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  // Product.fetchAll(product => {
  //   res.render("shop/index", {
  //     data: product,
  //     title: "SHOP",
  //     path: "/"
  //   });
  // });
  Product.fetchAll()
    .then(([rows, fields]) => {
      // console.log(JSON.stringify(rows));
      res.render("shop/index", {
        data: rows,
        title: "SHOP",
        path: "/"
      });
    })
    .catch(err => console.log(err));
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    title: "Order Page",
    path: "/orders"
  });
};
exports.getProducts = (req, res, next) => {
  // Product.fetchAll(product => {
  //   res.render("shop/product-list", {
  //     data: product,
  //     title: "Products List Page",
  //     path: "/products"
  //   });
  // });
  Product.fetchAll()
    .then(([rows, fields]) => {
      res.render("shop/index", {
        data: rows,
        title: "Products List Page",
        path: "/products"
      });
    })
    .catch(err => console.log(err));
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByIndex(prodId, (err, product) => {
    !err
      ? res.render("shop/product-detail", {
          product,
          title: product.title,
          path: "/products"
        })
      : res.status("404").send("<h1>Product not found</h1>");
  });
};
exports.getCart = (req, res, next) => {
  Cart.getProduct(cart => {
    Product.fetchAll(products => {
      const cartProduct = [];
      for (product of products) {
        cartProductData = cart.products.find(x => x.id === product.id);
        cartProductData &&
          cartProduct.push({ product, qty: cartProductData.qty });
      }

      res.render("shop/cart", {
        title: "Cart Page",
        path: "/cart",
        data: cartProduct
      });
    });
  });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByIndex(prodId, (err, product) => {
    !err && Cart.addProduct(prodId, product.price);
  });
  res.redirect("/");
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIndex(prodId, (err, product) => {
    !err && Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout Page",
    path: "/checkout"
  });
};
