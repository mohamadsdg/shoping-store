const User = require("../models/user");
var crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "fd03f82e5fdc49",
    pass: "f611fafd47a224"
  }
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render("auth/login", {
    title: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: { email: "", password: "" },
    validationError: { email: false, password: false }
  });
};
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render("auth/signup", {
    title: "Signup",
    path: "/signup",
    errorMessage: message,
    oldInput: { email: "", password: "", confirm_pass: "" },
    validationError: { email: false, password: false, confirm_pass: false }
  });
};
exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);

  res.render("auth/reset", {
    title: "Reset",
    path: "/reset",
    errorMessage: message
  });
};
exports.getNewPassword = (req, res, next) => {
  let message = req.flash("error");
  message.length > 0 ? (message = message[0]) : (message = null);
  User.findOne({
    reset_token: req.params.token,
    reset_token_exp: { $gt: Date.now() }
  })
    .then(user => {
      // console.log("fulfiiled=========>", user);
      if (!user) {
        // req.flash("error", "wrong Url");
        return res.redirect(`/404`);
      }
      return res.render("auth/new_password", {
        title: "Set new password",
        path: "/reset",
        userId: user._id.toString(),
        passwordToken: req.params.token,
        errorMessage: message
      });
    })
    .catch(rejected => {
      // console.log("rejected", rejected);
      throw rejected;
    });
};
exports.postLogin = (req, res, next) => {
  const validateResult = validationResult(req);
  const mail = req.body.email;
  const password = req.body.password;
  console.log("validateResult login", validateResult);
  /**
   * for css class
   */
  let rstEmail = validateResult.errors.find(e => e.param === "email");
  let rstPass = validateResult.errors.find(e => e.param === "password");

  if (!validateResult.isEmpty()) {
    // req.flash("error", validateResult.errors[0].msg);
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: validateResult.errors[0].msg,
      oldInput: { email: mail, password },
      validationError: {
        email: !!rstEmail,
        password: !!rstPass
      }
    });
  }
  User.findOne({ email: mail }).then(user => {
    if (!user) {
      // req.flash("error", "Invalid email or password ...");
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password ...",
        oldInput: { email: mail, password },
        validationError: {
          email: true,
          password: true
        }
      });
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
        // req.flash("error", "Invalid password ...");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid password ...",
          oldInput: { email: mail, password },
          validationError: {
            email: true,
            password: true
          }
        });
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
  const validateResult = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  /**
   * for css class
   */
  let rstEmail = validateResult.errors.find(e => e.param === "email");
  let rstPass = validateResult.errors.find(e => e.param === "password");
  let rstConfirm_pass = validateResult.errors.find(e => e.param === "password");
  /**
   *
   */
  if (!validateResult.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: validateResult.errors[0].msg,
      oldInput: { email, password, confirm_pass: req.body.confirmPassword },
      validationError: {
        email: !!rstEmail,
        password: !!rstPass,
        confirm_pass: !!rstConfirm_pass
      }
    });
  }
  bcrypt
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
      transporter.sendMail({
        to: email,
        from: "shop@node-complete.com",
        subject: "Signup succeeded!",
        text: "Awesome sauce",
        html: "<h1>You successfully signed up!</h1>"
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
exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(24, (err, buf) => {
    if (err) throw err;
    const token = buf.toString("hex");
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.reset_token = token;
        user.reset_token_exp = Date.now() + 3600000; //on hour
        return user.save();
      })
      .then(() => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "shop@node-complete.com",
          subject: "Reset password",
          html: ` 
                <p> you Requested a password reset</p>
                <p>Click this <a href='http://localhost:9000/reset/${token}'>Link</a> to set a new Password.</P>
                `
        });
      })
      .catch(err => {
        // console.log("===========>", err);
        throw err;
      });
  });
};
exports.postNewPassword = (req, res, next) => {
  const user_id = req.body.userId;
  const password = req.body.password;
  const passwordToken = req.body.passwordToken;
  User.findOne({
    _id: user_id,
    reset_token_exp: { $gt: Date.now() },
    reset_token: passwordToken
  })
    .then(user => {
      console.log("user", user);
      if (!user) {
        req.flash("error", "user not found");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then(encrpPass => {
          user.password = encrpPass;
          user.reset_token = undefined;
          user.reset_token_exp = undefined;
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
          transporter.sendMail({
            to: user.email,
            from: "shop@node-complete.com",
            subject: "Change Password",
            html: "<h1>You successfully Change Password</h1>"
          });
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
};
