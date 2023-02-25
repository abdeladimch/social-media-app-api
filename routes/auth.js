const express = require("express");
const router = express.Router();
const upload = require("../utils/imageUpload");

const { register, login } = require("../controllers/auth");

//
router.route("/register").post(upload.single("picture"), register);
router.route("/login").post(login);

module.exports = router;
