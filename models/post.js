const mongoos = require("mongoose");
const Schema = mongoos.Schema;

const postSchema = new Schema(
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
      required: true,
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoos.model("Post", postSchema);
