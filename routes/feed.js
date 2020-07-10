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

router.get("/post/:postId", feedController.getSinglePost);

module.exports = router;
