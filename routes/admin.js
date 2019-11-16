const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

// admin/add-product ==> GET
router.get("/add-product", adminController.getAddProduct);

// admin/add-product ==> POST
router.post("/add-product", adminController.postAddProduct);

// admin/products ==> Get
router.get("/products", adminController.getProducts);

// admin/product ==> Get
// router.post("/edit-product", adminController);

module.exports = router;
