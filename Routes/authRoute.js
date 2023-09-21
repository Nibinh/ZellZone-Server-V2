const express = require("express");
const router = express.Router();
const { upload } = require("../Services/AWS-S3");
const { verifyToken } = require("../Services/middleware");
const auth = require("../Controller/authController");

router.post("/register", upload.single("image"), auth.registerUser);
router.post("/login", auth.loginUser);
router.post("/logout", verifyToken, auth.logout);

module.exports = router;
