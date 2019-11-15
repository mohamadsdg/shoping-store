const express = require("express");
const router = express.Router();
const productController = require("../controller/product");

// admin/add-product ==> GET
router.get("/add-product", productController.getAddProduct);
// admin/product ==> POST
router.post("/product", productController.postAddProduct);

module.exports = router;
