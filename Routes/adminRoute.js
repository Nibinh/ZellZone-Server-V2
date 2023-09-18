const express = require("express");
const router = express.Router();
const { verifyToken, adminVerifyToken } = require("../Services/middleware");
const admin = require("../Controller/adminController");

router.post("/register", admin.AdminRegistration);
router.post("/login", admin.AdminLogin);
router.get("/getauser/:email", adminVerifyToken, admin.getUserAdmin);
router.delete("/deleteuser/:id", adminVerifyToken, admin.AdminDeleteUser);
router.get("/getnonactiveprod", adminVerifyToken, admin.getNonActiveProducts);
router.get(
  "/activatingproduct/:id",
  adminVerifyToken,
  admin.activatingProducts
);
router.get("/adminveiwproduct/:id", adminVerifyToken, admin.adminVeiwProduct);
router.delete(
  "/admindeleteproduct/:id",
  adminVerifyToken,
  admin.adminDeleteProduct
);
router.post("/logout", adminVerifyToken, admin.adminLogout);

module.exports = router;
