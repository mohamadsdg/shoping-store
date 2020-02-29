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
  const product = new Product(title, imageUrl, price, description);
  product
    .save()
    .then(resualt => {
      res.redirect("/");
    })
    .catch(err => {
      console.log("postAddProduct:catch", resualt);
    });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;

  !editMode && res.redirect("/");
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
};
exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description, productId);

  product
    .save()
    .then(result => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  // ## use Sequelize
  // #way1
  // Product.destroy({
  //   where: {
  //     id: productId
  //   }
  // })
  //   .then(result => {
  //     res.redirect("/admin/products");
  //     console.log("DELETE PRODUCT!");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  // # way2
  Product.findById(productId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));

  // ## custom method and use pure mysql2
  // Product.deleteByIndex(productId)
  //   .then(() => {
  //     console.log("DELETE PRODUCT!");
  //     res.redirect("/");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
exports.getProducts = (req, res, next) => {
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
};
