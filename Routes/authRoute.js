const express = require("express");
const router = express.Router();
const { upload } = require("../Services/AWS-S3");

const auth = require("../Controller/authController");

router.post("/register", upload.single("image"), auth.registerUser);
router.post("/login", auth.loginUser);

module.exports = router;
