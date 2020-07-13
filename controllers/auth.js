const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

exports.login = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error("validation Error");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  const email = req.body.email;
  const password = req.body.password;
  let loadeduser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error("A User With this Email could not be found !");
        err.statusCode = 401;
        throw err;
      }
      loadeduser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const err = new Error("wrong password");
        err.statusCode = 401;
        throw err;
      }
      const token = jwt.sign(
        { email: loadeduser.email, userId: loadeduser._id.toString() },
        "somesupersecretsecret",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token: token,
        userId: loadeduser._id.toString(),
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
