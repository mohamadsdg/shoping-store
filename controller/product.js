exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    title: "Add Product",
    path: "admin/add-product"
  });
};

const product = [];
exports.postAddProduct = (req, res, next) => {
  product.push(req.body);
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    data: product,
    title: "SHOP",
    path: "/"
  });
};
