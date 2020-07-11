const monoose = require("mongoose");
const Schema = monoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Im new user ",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = monoose.model("User", UserSchema);
