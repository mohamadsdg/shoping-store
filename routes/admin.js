const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

// admin/add-product ==> GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// admin/add-product ==> POST
router.post(
  "/add-product",
  [
    body("title").isAlphanumeric().isLength({ min: 2 }).trim(),
    body("price").isFloat().trim(),
    body("description").isLength({ min: 2, max: 200 }),
  ],
  isAuth,
  adminController.postAddProduct
);

// admin/edit-product ==> GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// admin/edit-product ==> POST
router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 2 }).trim(),
    body("price").isFloat().trim(),
    body("description").isLength({ min: 2, max: 200 }),
  ],
  isAuth,
  adminController.postEditProduct
);

// admin/delete-product ==> POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

// admin/delete-product ==> API
router.delete("/product/:productId", isAuth, adminController.deleteProduct);

// admin/products ==> Get
router.get("/products", isAuth, adminController.getProducts);

// admin/product ==> Get
// router.post("/edit-product", adminController);

module.exports = router;
