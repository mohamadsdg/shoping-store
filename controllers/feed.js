const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const io = require("../socket");
const Post = require("../models/post");
const User = require("../models/user");

exports.getPost = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.countDocuments();
    const posts = await Post.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      id: req.userId,
      posts: posts,
      totalItems: totalItems,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
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
  const image = req.file.path;
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    creator: req.userId,
    imageUrl: image,
  });

  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    io.getInstance().emit("post", {
      action: "create",
      post: { ...post._doc, creator: { _id: user._id, name: user.name } },
    });

    res.status(201).json({
      message: "Product create successfully",
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(post_id).populate("creator", "name");
    if (!post) {
      const error = new Error("not found");
      error.statusCode = 404;
      throw error;
    }
    // Authorization User
    if (req.userId != post.creator._id.toString()) {
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
    const result = await post.save();
    io.getInstance().emit("post", { action: "update", post: result });
    res.status(200).json({ message: "Post Update", post: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getSinglePost = async (req, res, next) => {
  const post_id = req.params.postId;
  const post = await Post.findById(post_id).populate("creator", "name");

  try {
    if (!post) {
      const error = new Error("not found");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ message: "successful", post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
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
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    io.getInstance().emit("post", {
      action: "delete",
      post: postId,
    });

    res.status(200).json({
      message: "Delete Successfull",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const clearImag = (filePath) => {
  // console.log("filePath", filePath);
  filePath = path.join(__dirname, "..", filePath);
  // console.log("filePath2", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
