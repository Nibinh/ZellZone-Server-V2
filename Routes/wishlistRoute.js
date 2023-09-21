const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Services/middleware");
const wishlist = require("../Controller/wishlistController");

router.get(
  "/addtowishlist/:userEmail/:prodId",
  verifyToken,
  wishlist.addToWishlist
);
router.get(
  "/removing/:userEmail/:prodId",
  verifyToken,
  wishlist.removeFromWishlist
);
router.get("/gettingall/:id", verifyToken, wishlist.viewAllWishlist);

module.exports = router;
