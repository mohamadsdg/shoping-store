const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");
const cors = require("cors");

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

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("please Enter a valid Email")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  UserController.login
);

router.options("/status", cors()); // enable pre-flight request
router.get("/status", isAuth, UserController.getUserStatus);
router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  UserController.updateUserStatus
);

module.exports = router;
