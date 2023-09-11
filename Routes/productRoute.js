const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Services/middleware");
const { upload } = require("../Services/AWS-S3");

const prodController = require("../Controller/productController");

router.post("/addproduct", upload.single("image"), prodController.addProduct);
router.get("/veiwproduct/:id", prodController.veiwProduct);
router.get("/allproducts", prodController.getAllProducts);
router.delete("/deleteproduct/:id", prodController.deleteProduct);

module.exports = router;
