const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPost = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "this is the first post!",
        creator: { name: "MohamadReza" },
        createdAt: new Date(),
        imageUrl: "images/tst.png",
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.payload = errors.array();
    throw error;
    // return res
    //   .status(422)
    //   .json({ message: "validation failed", error: errors.array() });
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    creator: { name: "MohamadReza" },
    imageUrl: "images/tst.png",
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product create successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
