exports.errorNotFound = (req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found", path: "/404" });
};
exports.error500 = (req, res, next) => {
  let message = req.flash("error500");
  message.length > 0 ? (message = message[0]) : (message = null);
  // console.log("error500", message);
  res
    .status(500)
    .render("500", { title: "Error !", path: "/500", errorMessage: message });
};
