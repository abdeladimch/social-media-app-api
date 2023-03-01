const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
} = require("../controllers/post");

router.get("/", authMiddleware, getAllPosts);
router.post("/:userId", authMiddleware, createPost);
router.get("/likePost", authMiddleware, likePost);
router.get("/:userId/posts", authMiddleware, getUserPosts);

module.exports = router;
