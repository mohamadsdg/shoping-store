const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

app.use(express.urlencoded({ extended: true }));
app.use(shopRoute);
// add filtering mecanism
app.use("/admin", adminRoute);

app.use((req, res, next) => {
  // res.status(404).send("<h1>Page not Found</h1>");
  res.sendFile(path.join(__dirname, "views", "404.html"));
});
// const server = http.createServer(app);
app.listen(9222);
