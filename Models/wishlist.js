const mongoose = require("../Services/db");

const wishlistSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  wishlsitTime: {
    type: Date,
    default: new Date().toISOString,
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
