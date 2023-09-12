const Product = require("../Models/products");
const User = require("../Models/users");
const { getImageUrlFromS3 } = require("../Services/AWS-getImage");

//adding Product to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, prodId } = req.params;
    console.log(userId);
    console.log(prodId);
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send("user not available");

    const product = await Product.findOne({ _id: prodId });
    if (!product) return res.status(400).send("product not available");

    user.wishlist.push(prodId);
    user.save();
    res.status(200).send("Added to Wishlsit");
  } catch (error) {
    console.log(error);
  }
};

//removing from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, prodId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).send("user not available");

    const product = await Product.findOne({ _id: prodId });
    if (!product) return res.status(400).send("product not available");

    user.wishlist.pull(prodId);
    user.save();
    res.status(200).send("Removed from Wishlsit");
  } catch (error) {
    console.log(error);
  }
};

//view all wishlist product
const viewAllWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findOne({ _id: id }).populate({ path: "wishlist" });
    if (!data) return res.status(400).send("user not available");

    for (let product of data.wishlist) {
      if (product.imageName) {
        const imageurl = await getImageUrlFromS3(product.imageName);
        product.imageUrl = imageurl;
      }
    }

    await data.save();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addToWishlist,
  removeFromWishlist,
  viewAllWishlist,
};
