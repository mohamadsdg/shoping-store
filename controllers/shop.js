const Product = require("../models/products");
const Cart = require("../models/cart");
const cartItem = require("../models/cartItem");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  // ## use Sequelize
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
  // ## custom method and use pure mysql2
  // Product.fetchAll()
  //   .then(([rows, fields]) => {
  //     res.render("shop/index", {
  //       data: rows,
  //       title: "SHOP",
  //       path: "/"
  //     });
  //   })
  //   .catch(err => console.log(err));
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
  // ## use Sequelize
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

  // ## custom method and use pure mysql2
  // Product.fetchAll()
  //   .then(([rows, fields]) => {
  //     res.render("shop/index", {
  //       data: rows,
  //       title: "Products List Page",
  //       path: "/products"
  //     });
  //   })
  //   .catch(err => console.log(err));
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findById(prodId)
  // ## use Sequelize
  // Product.findAll({
  //   where: {
  //     id: prodId
  //   }
  // })
  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product, //product[0]
        title: product.title, //product[0].title
        path: "/products"
      });
    })
    .catch(err => {
      console.log("getProduct", err);
      res.status("404").send("<h1>Product not found</h1>");
    });

  // ## custom method and use pure mysql2
  // Product.findByIndex(prodId)
  //   .then(([product]) => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       title: product[0].title,
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
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
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
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let _cart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      _cart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let _product;
      if (products.length > 0) {
        _product = products[0];
      }
      if (_product) {
        let oldQuantity = _product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return _product;
      }
      return Product.findById(prodId);
    })
    .then(product => {
      // console.log("adde to cart ======>", product);
      return _cart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(result => {
      // console.log("result cart ======>", result);
      res.redirect("/cart");
    })
    .catch(err => {
      console.log(err);
    });
  // res.redirect("/");
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id: prodId } }))
    .then(products => products[0].cartItem.destroy())
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => {
      console.log(err);
    });
  // Product.findByIndex(prodId, (err, product) => {
  //   !err && Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout Page",
    path: "/checkout"
  });
};
