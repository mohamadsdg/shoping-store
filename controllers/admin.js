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
  // ## use Sequelize
  Product.create({ title, imageUrl, price, description })
    .then(result => {
      res.redirect("/");
      console.log("ADD PRODUCT SUCCESSFULL");
    })
    .catch(err => {
      console.log(err);
    });

  // ## custom method and use pure mysql2
  // const product = new Product(null, title, imageUrl, price, description);
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;

  !editMode && res.redirect("/");

  // ## use Sequelize
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

  // ## custom method and use pure mysql2
  // Product.findByIndex(prodId)
  //   .then(([product]) => {
  //     res.render("admin/edit-product", {
  //       title: "Edit Product",
  //       path: "admin/edit-product",
  //       editMode: editMode,
  //       product: product[0]
  //     });
  //   })
  //   .catch(err => {
  //     console.log("getEditProduct", err);
  //     res.status("404").send("<h1>Product not found</h1>");
  //   });
};
exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  let id = productId;

  // ## use Sequelize
  // #  way 1
  // Product.findById(id)
  //   .then(product => {
  //     product.title = title;
  //     product.imageUrl = imageUrl;
  //     product.price = price;
  //     product.description = description;
  //     return product.save();
  //   })
  //   .then(result => {
  //     console.log("UPDATED PRODUCT!");
  //     res.redirect("/admin/products");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // #  way 2
  const Op = require("sequelize").Op;
  Product.update(
    {
      title,
      imageUrl,
      price,
      description
    },
    {
      where: {
        // id: id
        id: {
          [Op.eq]: id
        }
      }
    }
  )
    .then(result => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch(err => {});

  // Product.findById(id)
  //   .then(product => {

  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // ## custom method and use pure mysql2
  // const product = new Product(null, title, imageUrl, price, description);
  // product
  //   .editByIndex(id)
  //   .then(() => {
  //     res.redirect("/admin/products");
  //   })
  //   .catch(err => {
  //     console.log("postEditProduct", err);
  //   });
};
exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteByIndex(productId)
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getProducts = (req, res, next) => {
  // ## use Sequelize
  Product.findAll()
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

  // ## custom method and use pure mysql2
  // Product.fetchAll()
  //   .then(([row]) => {
  //     res.render("admin/products", {
  //       data: row,
  //       title: "Products List Page In Admin",
  //       path: "admin/products"
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
