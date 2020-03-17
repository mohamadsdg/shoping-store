const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render("auth/login", {
    title: "Login",
    path: "/login",
    errorMessage: message
  });
};
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render("auth/signup", {
    title: "Signup",
    path: "/signup",
    errorMessage: message
  });
};
exports.postLogin = (req, res, next) => {
  const mail = req.body.email;
  const password = req.body.password;

  User.findOne({ email: mail }).then(user => {
    if (!user) {
      req.flash("error", "Invalid email or password ...");
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
        req.flash("error", "Invalid password ...");
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
        req.flash(
          "error",
          "E-mail exsist already, please pick a diffrent mail "
        );
        return res.redirect("/signup");
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
  // console.log(req.body._csrf);
  req.session.destroy(function(err) {
    // cannot access session here
    // console.log("postLogout", err);
    res.redirect("/");
  });
};
