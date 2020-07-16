const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
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

  try {
    const hashPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      name: name,
      password: hashPass,
    });
    const result = await user.save();
    res
      .status(201)
      .json({ message: "User Create !", data: { userId: result._id } });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error("validation Error");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    // check userExsit
    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("A User With this Email could not be found !");
      err.statusCode = 401;
      throw err;
    }

    // check password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("wrong password");
      err.statusCode = 401;
      throw err;
    }

    // generate token
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      "somesupersecretsecret",
      {
        expiresIn: "1h",
      }
    );

    // send response
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
