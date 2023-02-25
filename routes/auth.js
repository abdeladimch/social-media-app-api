const express = require("express");
const router = express.Router();
const upload = require("../utils/imageUpload");

const { register, login, logout } = require("../controllers/auth");
const authMiddleware = require("../middlewares/authMiddleware");

//
router.route("/register").post(upload.single("picture"), register);
router.route("/login").post(login);
router.route("/logout").get(authMiddleware, logout);

module.exports = router;
