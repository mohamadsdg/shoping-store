const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.signUp = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error("validation Error");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashPass) => {
      const user = new User({
        email: email,
        name: name,
        password: hashPass,
      });

      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "User Create !", data: { userId: result._id } });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
