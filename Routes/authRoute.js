const express = require("express");
const router = express.Router();

const auth = require("../Controller/authController");

router.post("/register", auth.registerUser);

module.exports = router;
