const mongoos = require("mongoose");
const Schema = mongoos.Schema;

const PostSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    imageUrl: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoos.model("Post", PostSchema);
