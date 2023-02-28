const express = require("express");
const router = express.Router();
const upload = require("../utils/imageUpload");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
} = require("../controllers/post");

router.get("/", authMiddleware, getAllPosts);
router.post("/", authMiddleware, upload.single("picture"), createPost);
router.get("/likePost", authMiddleware, likePost);
router.get("/:id/posts", authMiddleware, getUserPosts);

module.exports = router;
