const express = require("express");
const router = express.Router();

const wishlist = require("../Controller/wishlistController");

router.get("/addtowishlist/:userId/:prodId", wishlist.addToWishlist);
router.get("/removing/:userId/:prodId", wishlist.removeFromWishlist);
router.get("/gettingall/:id", wishlist.viewAllWishlist);

module.exports = router;
