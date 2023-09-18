const JWT = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(404).send("no token provided");
  try {
    const data = JWT.verify(token, JWT_KEY);
    console.log("Valid Token");
    next();
  } catch (error) {
    console.log("Inavlid Token");
    res.status(404).send("Please Login");
  }
};

exports.adminVerifyToken = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.status(404).send("no token provided");
  try {
    const data = JWT.verify(token, JWT_KEY);
    console.log("Admin Valid Token");
    next();
  } catch (error) {
    console.log("Admin Inavlid Token");
    res.status(404).send("Admin Please Login");
  }
};
