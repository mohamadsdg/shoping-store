// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   // user: "mohamadreza",
//   // password: "123",
//   database: "node-complete"
// });
// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", null, {
  dialect: "mysql",
  host: "localhost"
});
module.exports = sequelize;
