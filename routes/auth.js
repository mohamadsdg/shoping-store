const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const User = require("../models/user");
const { check, body } = require("express-validator");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      console.log(value);
      if (value === "mohamad.r.sadeghi93@gmail.com")
        throw new Error("forbidden email");

      return true;
    }),
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(
              "E-mail already in use, please pick a difrent email"
            );
          }
        });
      }),
    body("password", "password has letter and between 2-6 character")
      .isLength({ min: 2, max: 6 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password not Match");
      }
      return true;
    })
  ],
  authController.postSignup
);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
