const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// /login ==> GET
router.get("/login", authController.getLogin);

// /login ==> POST
router.post("/login", authController.postLogin);

// /login ==> POST
router.post("/logout", authController.postLogout);

module.exports = router;
