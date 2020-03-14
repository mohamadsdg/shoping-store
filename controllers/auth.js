const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // console.dir(req.get("Cookie"));
  // let valCookie;
  // req.get("Cookie") &&
  //   req
  //     .get("Cookie")
  //     .split(";")
  //     .find(
  //       val => (valCookie = val.search("isLoggin") !== -1 && val.split("=")[1])
  //     );
  res.render("auth/login", {
    title: "Login",
    path: "/login",
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
exports.postLogout = (req, res, next) => {
  req.session.destroy(function(err) {
    // cannot access session here
    // console.log("postLogout", err);
    res.redirect("/");
  });
};
