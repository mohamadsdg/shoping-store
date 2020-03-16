module.exports = (req, res, next) => {
  if (!req.session.has_login) {
    return res.redirect("/login");
  }
  next();
};
