const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Services/middleware");
const { upload } = require("../Services/AWS-S3");

const user = require("../Controller/userController");

router.get("/getUser/:id", verifyToken, user.getUser);
router.get("/getallusers", user.gettingAllUsers);
router.put("/edituser/:id", verifyToken, upload.single("image"), user.editUser);

module.exports = router;
