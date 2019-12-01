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

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION
  }
);
module.exports = sequelize;
