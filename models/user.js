const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: null,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING }
});
module.exports = User;
