const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Services/middleware");

const user = require("../Controller/userController");

router.get("/getUser/:id", verifyToken, user.getUser);

module.exports = router;
