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
  const mail = req.body.email;
  const password = req.body.password;

  User.findOne({ email: mail }).then(user => {
    if (!user) {
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then(result => {
        // console.log("res", result);
        if (result) {
          req.session.has_login = true;
          req.session.user = user;
          return req.session.save(err => {
            // console.log("save session err", err);
            res.redirect("/");
          });
        }
        return res.redirect("/login");
      })
      .catch(err => {
        // console.log(err);
        throw err;
      });
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
      if (user) {
        return res.redirect("/login");
      }
      return bcrypt
        .hash(password, 12)
        .then(encrpPass => {
          const _user = new User({
            email,
            password: encrpPass,
            carts: { items: [] }
          });
          return _user.save();
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(err => {
          throw err;
        });
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
