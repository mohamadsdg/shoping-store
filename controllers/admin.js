const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add Product",
    path: "admin/add-product",
    editMode: false
  });
};
exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  // #mongoos
  // using built in API mongoose for save document
  const product = new Product({
    title,
    imageUrl,
    price,
    description
  });
  product
    .save()
    .then(resualt => {
      console.log("CREATE PRODUCT");
      res.redirect("/");
    })
    .catch(err => {
      console.log("postAddProduct:catch", err);
    });

  // #mongo
  // const product = new Product(
  //   title,
  //   imageUrl,
  //   price,
  //   description,
  //   null,
  //   req.user._id
  // );
  // product
  //   .save()
  //   .then(resualt => {
  //     res.redirect("/");
  //   })
  //   .catch(err => {
  //     console.log("postAddProduct:catch", resualt);
  //   });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;

  !editMode && res.redirect("/");
  //#mongoose
  // using built-in middleware API (findById) mongoose for fetch-single document
  // auto convert string to ObjectId type in mongodb
  Product.findById(prodId)
    .then(product => {
      res.render("admin/edit-product", {
        title: "Edit Product",
        path: "admin/edit-product",
        editMode: editMode,
        product: product
      });
    })
    .catch(err => {
      console.log(err);
      res.status("404").send("<h1>Product not found</h1>");
    });
  // #mongo
  // Product.findById(prodId)
  //   .then(product => {
  //     res.render("admin/edit-product", {
  //       title: "Edit Product",
  //       path: "admin/edit-product",
  //       editMode: editMode,
  //       product: product
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status("404").send("<h1>Product not found</h1>");
  //   });
};
exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  // #mongoos
  // using built-in middleware API (findById) mongoose for fetch-single product
  // update procedural product then usgin save API
  Product.findById(productId)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(result => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });

  // #mongo
  // product
  //   .save()
  //   .then(result => {
  //     console.log("UPDATED PRODUCT!");
  //     res.redirect("/admin/products");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  // #mongoose
  // using built-in middleware API (findByIdAndDelete) mongoose for delete product
  Product.findByIdAndDelete(productId)
    .then(() => {
      console.log("REMOVED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
  // #mongo
  // Product.destroy(productId)
  //   .then(() => {
  //     console.log("REMOVED PRODUCT");
  //     req.user
  //       .removeFromCart(productId)
  //       .then(() => {
  //         console.log("REMOVED PRODUCT FROM CART");
  //         res.redirect("/admin/products");
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .catch(err => console.log(err));
};
exports.getProducts = (req, res, next) => {
  // #mongoose
  // using built-in middleware API mongoose for fetch-all document
  Product.find()
    .then(product => {
      res.render("admin/products", {
        data: product,
        title: "Products List Page In Admin",
        path: "admin/products"
      });
    })
    .catch(err => {
      console.log(err);
    });

  // #mongoo
  //   Product.findAll()
  //     .then(product => {
  //       res.render("admin/products", {
  //         data: product,
  //         title: "Products List Page In Admin",
  //         path: "admin/products"
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
};
