const mongoose = require("../Services/db");

const productSchema = mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  productAge: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imagename: {
    type: String,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  active: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("Product", productSchema);
