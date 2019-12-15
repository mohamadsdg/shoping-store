const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const orderItem = sequelize.define(
  "orderItem",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    quantity: Sequelize.INTEGER
  },
  { underscored: true }
);
module.exports = orderItem;
