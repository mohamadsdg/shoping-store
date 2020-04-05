const Product = require("../models/products");
const mongoos = require("mongoose");
const { validationResult } = require("express-validator/check");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add Product",
    path: "admin/add-product",
    editMode: false,
    oldInput: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
    validationError: {
      email: false,
      imageUrl: false,
      price: false,
      description: false,
    },
  });
};
exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const validateResult = validationResult(req);
  console.log(req.body, req.file);
  /**
   * for css class
   */
  let rstTitle = validateResult.errors.find((e) => e.param === "title");
  let rstUrl = validateResult.errors.find((e) => e.param === "imageUrl");
  let rstPrice = validateResult.errors.find((e) => e.param === "price");
  let rstDesc = validateResult.errors.find((e) => e.param === "description");

  if (!validateResult.isEmpty()) {
    // req.flash("error", validateResult.errors[0].msg);
    return res.status(422).render("admin/add-product", {
      path: "admin/add-product",
      title: "Add Product",
      errorMessage: validateResult.errors,
      editMode: false,
      oldInput: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      validationError: {
        title: !!rstTitle,
        imageUrl: !!rstUrl,
        price: !!rstPrice,
        description: !!rstDesc,
      },
    });
  }
  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.user,
  });
  product
    .save()
    .then((resualt) => {
      console.log("CREATE PRODUCT");
      res.redirect("/");
    })
    .catch((err) => {
      // console.log("postAddProduct:catch", err);
      // throw new Error(err);
      // return res.status(500).render("admin/add-product", {
      //   path: "admin/add-product",
      //   title: "Add Product",
      //   errorMessage: [
      //     { param: "Error", msg: "data base operator has failed" }
      //   ],
      //   editMode: false,
      //   oldInput: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   validationError: {
      //     title: !!rstTitle,
      //     imageUrl: !!rstUrl,
      //     price: !!rstPrice,
      //     description: !!rstDesc
      //   }
      // });
      // res.redirect("/500");

      // console.log("catch postAddProduct : ====>", err);
      // console.log("catch postAddProduct NEW : ====>", new Error(err));

      // const _err = new Error(err);
      // _err.httpStatusCode = 500;
      // return next(_err);

      err.name = err.name;
      err.errmsg = err.message;
      err.httpStatusCode = 500;
      err.currentStack = err.stack;

      return next(err);
    });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;

  !editMode && res.redirect("/");
  //#mongoose
  // using built-in middleware API (findById) mongoose for fetch-single document
  // auto convert string to ObjectId type in mongodb
  Product.findOne({ _id: prodId, userId: req.user._id })
    .then((product) => {
      // console.log(`product`, product);
      if (!product) {
        req.flash("error", "access denied to Edit product!");
        return res.redirect("/admin/products");
      }
      res.render("admin/edit-product", {
        title: "Edit Product",
        path: "admin/edit-product",
        editMode: editMode,
        product: product,
        hasError: false,
        validationError: {
          email: false,
          imageUrl: false,
          price: false,
          description: false,
        },
      });
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;

      return next(err);

      // res.status("404").send("<h1>Product not found</h1>");
    });
};
exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  const validateResult = validationResult(req);
  console.log(validateResult.errors);
  /**
   * for css class
   */
  let rstTitle = validateResult.errors.find((e) => e.param === "title");
  let rstUrl = validateResult.errors.find((e) => e.param === "imageUrl");
  let rstPrice = validateResult.errors.find((e) => e.param === "price");
  let rstDesc = validateResult.errors.find((e) => e.param === "description");

  if (!validateResult.isEmpty()) {
    // req.flash("error", validateResult.errors[0].msg);
    return res.status(422).render(`admin/edit-product`, {
      path: "admin/edit-product",
      title: "Edit Product",
      errorMessage: validateResult.errors,
      editMode: true,
      hasError: true,
      oldInput: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        productId: productId,
      },
      validationError: {
        title: !!rstTitle,
        imageUrl: !!rstUrl,
        price: !!rstPrice,
        description: !!rstDesc,
      },
    });
  }

  // #mongoos
  // using built-in middleware API (findById) mongoose for fetch-single product
  // update procedural product then usgin save API
  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  // #mongoose
  // using built-in middleware API (findByIdAndDelete) mongoose for delete product
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((fulfilled) => {
      // console.log("fulfilled", fulfilled.deletedCount);
      if (!fulfilled.deletedCount) {
        req.flash("error", "access denied to Delete product!");
        return res.redirect("/admin/products");
      }
      console.log("REMOVED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
exports.getProducts = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  // #mongoose
  // using built-in middleware API mongoose for fetch-all document
  Product.find() // for authorize hidden products  { userId: req.user._id }
    // .select("title price")
    .populate("userId", "email -_id")
    .then((product) => {
      res.render("admin/products", {
        data: product,
        title: "Products List Page In Admin",
        path: "admin/products",
        errorMessage: message,
      });
    })
    .catch((err) => {
      err.name = err.name;
      err.errmsg = err.message;
      err.currentStack = err.stack;
      err.httpStatusCode = 500;
      return next(err);
    });
};
