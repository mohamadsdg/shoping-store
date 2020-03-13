exports.getLogin = (req, res, next) => {
  //   console.dir(req.get("Cookie"));
  let valCookie;
  req.get("Cookie") &&
    req
      .get("Cookie")
      .split(";")
      .find(
        val => (valCookie = val.search("isLoggin") !== -1 && val.split("=")[1])
      );
  res.render("auth/login", {
    title: "Login",
    path: "/login",
    has_login: valCookie || false
  });
};
exports.postLogin = (req, res, next) => {
  //   res.cookie("isLoggin", "true");
  res.setHeader("set-cookie", "isLoggin=true; HttpOnly");
  //   console.log("postLogin", req.body);
  res.redirect("/");
};
