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
  const product = new Product(null, title, imageUrl, price, description);
  product.save();

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  !editMode && res.redirect("/");

  Product.findByIndex(prodId, (err, product) => {
    !err &&
      res.render("admin/edit-product", {
        title: "Edit Product",
        path: "admin/edit-product",
        editMode: editMode,
        product
      });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  let id = productId;
  const product = new Product(id, title, imageUrl, price, description);
  product.save();

  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(product => {
    res.render("admin/products", {
      data: product,
      title: "Products List Page In Admin",
      path: "admin/products"
    });
  });
};
