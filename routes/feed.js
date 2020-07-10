const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const feedController = require("../controllers/feed");
const { Upload } = require("../middleware/handleImage");

// GET /feed/posts
router.get("/posts", feedController.getPost);

// POST /feed/posts
router.post(
  "/posts",
  Upload.single("image"),
  [
    body("title", "معتبر نمیباشد").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

// GET /feed/post/:postId
router.get("/post/:postId", feedController.getSinglePost);

// POST /feed/posts
router.put(
  "/post/:postId",
  Upload.single("image"),
  [
    body("title", "معتبر نمیباشد").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

module.exports = router;
