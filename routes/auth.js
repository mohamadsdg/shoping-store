const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value,{req})=>{
      console.log(value);
      if(value === 'mohamad.r.sadeghi93@gmail.com' ) 
        throw new Error('forbidden email')

      return true
    }),
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post("/signup",[check('email').isEmail(),check('password')], authController.postSignup);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
