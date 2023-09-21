const express = require("express");
const router = express.Router();
const { verifyToken, adminVerifyToken } = require("../Services/middleware");
const { upload } = require("../Services/AWS-S3");

const user = require("../Controller/userController");

router.get("/getUser/:id", user.getUser);
router.get("/getallusers", adminVerifyToken, user.gettingAllUsers);
router.put("/edituser/:id", verifyToken, upload.single("image"), user.editUser);

module.exports = router;
