const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getUser,
  getAllUsers,
  getUserFriends,
  addremoveFriend,
} = require("../controllers/user");

router.get("/getAllUsers", authMiddleware, getAllUsers);
router.get("/:userId", authMiddleware, getUser);
router.get("/:userId/friends", authMiddleware, getUserFriends);
router.patch(
  "/addRemoveFriend/:userId/:friendId",
  authMiddleware,
  addremoveFriend
);

module.exports = router;
