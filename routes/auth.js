const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../controllers/auth");
const User = require("../models/user");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("please Enter a valid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then((userDoc) => {
            if (!userDoc) {
              return Promise.reject("E-mail address already exists !");
            }
          })
          .catch(() => {});
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  UserController.signUp
);

module.exports = router;
