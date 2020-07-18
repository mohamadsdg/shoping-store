const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const feedController = require("../controllers/feed");
const { Upload } = require("../middleware/handleImage");
const cors = require("cors");

const isAuth = require("../middleware/is-auth");

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPost);

// POST /feed/posts
router.post(
  "/posts",
  isAuth,
  Upload.single("image"),
  [
    body("title", "معتبر نمیباشد").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

// GET /feed/post/:postId
router.get("/post/:postId", isAuth, feedController.getSinglePost);

// POST /feed/posts
router.put(
  "/post/:postId",
  isAuth,
  Upload.single("image"),
  [
    body("title", "معتبر نمیباشد").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

// DELETE /feed/post/:postId
router.options("/post/:postId", cors()); // enable pre-flight request
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
