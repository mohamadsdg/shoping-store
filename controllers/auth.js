const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    title: "Login",
    path: "/login",
    has_login: false
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    title: "Signup",
    path: "/signup",
    has_login: false
  });
};
exports.postLogin = (req, res, next) => {
  User.findById("5e60b7e821b1da2de43511be").then(user => {
    req.session.has_login = true;
    req.session.user = user;
    res.redirect("/");
  });
  // res.cookie("isLoggin", "true");
  // res.setHeader("set-cookie", "isLoggin=true; HttpOnly");
  // console.log("postLogin", req.body);
  // res.redirect("/");
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (user) res.redirect("/login");
      return bcrypt.hash(password, 12);
    })
    .then(encrpPass => {
      _user = new User({ email, password: encrpPass, carts: { items: [] } });
      _user.save();
      res.redirect("/");
    })
    .catch(err => {
      throw err;
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(function(err) {
    // cannot access session here
    // console.log("postLogout", err);
    res.redirect("/");
  });
};
