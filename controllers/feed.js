const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPost = (req, res, next) => {
  const currentPage = req.query.page || 1;
  let totalPost;
  Post.countDocuments()
    .then((count) => {
      totalPost = count;
      return Post.find()
        .skip((currentPage - 1) * totalPost)
        .limit(currentPage);
    })
    .then((posts) => {
      res.status(200).json({
        id: req.userId,
        posts: posts,
        totalItems: totalPost,
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
  const image = req.file.path.replace(/\\/g, "/");
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    creator: req.userId,
    imageUrl: image,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(() => {
      res.status(201).json({
        message: "Product create successfully",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const post_id = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let image = req.body.image;

  const errors = validationResult(req);
  // validate input
  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.payload = errors.array();
    throw error;
  }
  // validate file(image)
  if (req.file) {
    image = req.file.path.replace(/\\/g, "/");
  }
  if (!image) {
    const error = new Error("No file Picked!");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(post_id)
    .then((post) => {
      if (!post) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      // Authorization
      if (req.userId != post.creator.toString()) {
        const error = new Error("Not Authurize !");
        error.statusCode = 403;
        throw error;
      }

      if (image !== post.imageUrl) {
        clearImag(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = image;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post Update",
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

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post Not Found !");
        error.statusCode = 404;
        throw error;
      }
      // Authorization
      if (req.userId != post.creator.toString()) {
        const error = new Error("Not Authurize !");
        error.statusCode = 403;
        throw error;
      }
      clearImag(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(() => User.findById(req.userId))
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(() => {
      res.status(200).json({
        message: "Delete Successfull",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImag = (filePath) => {
  // console.log("filePath", filePath);
  filePath = path.join(__dirname, "..", filePath);
  // console.log("filePath2", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
