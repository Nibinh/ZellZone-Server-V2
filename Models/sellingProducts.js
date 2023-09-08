const mongoose = require("../Services/db");

const soldProductSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  soldTime: {
    type: Date,
    default: new Date().toISOString,
  },
});

module.exports = mongoose.model("Selling", soldProductSchema);
