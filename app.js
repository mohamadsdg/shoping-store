const http = require("http");
const express = require("express");
const app = express();
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

app.use(express.urlencoded({ extended: true }));
app.use([shopRoute, adminRoute]);

app.use((req, res, next) => {
  res.status(404).send("<h1>Page not Found</h1>");
});
// const server = http.createServer(app);
app.listen(9222);
