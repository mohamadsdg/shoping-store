const { validationResult } = require("express-validator");

const Post = require("../models/post");
const post = require("../models/post");

exports.getPost = (req, res, next) => {
  post
    .find()
    .then((posts) => {
      res.status(200).json({
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  // console.log(req.body);
  const errors = validationResult(req);
  console.log(req.file);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.payload = errors.array();
    throw error;
    // return res
    //   .status(422)
    //   .json({ message: "validation failed", error: errors.array() });
  }
  if (!req.file) {
    const error = new Error("No Image Provided");
    error.statusCode = 422;
    throw error;
  }
  const image = req.file.path;
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    creator: { name: "MohamadReza" },
    imageUrl: image,
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

exports.getSinglePost = (req, res, next) => {
  const post_id = req.params.postId;

  Post.findById(post_id)
    .then((post) => {
      if (!post) {
        const error = new Error("not found");
        error.statusCode = 422;
        throw error;
      }
      res.status(200).json({
        message: "successful",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
