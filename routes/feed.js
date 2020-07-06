const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const feedController = require("../controllers/feed");

// GET /feed/posts
router.get("/posts", feedController.getPost);

// POST /feed/posts
router.post(
  "/posts",
  [
    body("title", "معتبر نمیباشد").trim().isLength({ min: 5}),
    body("content").trim().isLength({ min: 5}),
  ],
  feedController.createPost
);

module.exports = router;
