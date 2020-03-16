const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// /login ==> GET
router.get("/login", authController.getLogin);

// /login ==> GET
router.get("/signup", authController.getSignup);

// /login ==> POST
router.post("/login", authController.postLogin);

// /login ==> POST
router.post("/logout", authController.postLogout);

// /signup ==> POST
router.post("/signup", authController.postSignup);

module.exports = router;
