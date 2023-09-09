const mongoose = require("../Services/db");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    imageName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
