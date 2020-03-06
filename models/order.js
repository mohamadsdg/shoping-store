// #mongoose
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const order = new schema(
  {
    products: [
      {
        product: { type: Object, require: true },
        quantity: { type: Number, require: true }
      }
    ],
    user: {
      name: { type: String, require: true },
      userId: {
        type: schema.Types.ObjectId,
        require: true,
        ref: "User"
      }
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
module.exports = mongoose.model("Order", order);

// #mongodb
// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Order = sequelize.define(
//   "order",
//   {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false
//     }
//   },
//   { underscored: true }
// );
// module.exports = Order;
