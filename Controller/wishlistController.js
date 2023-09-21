const Product = require("../Models/products");
const User = require("../Models/users");
const { getImageUrlFromS3 } = require("../Services/AWS-getImage");

//adding Product to Wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userEmail, prodId } = req.params;
    console.log(req.params);
    console.log(userEmail);
    console.log(prodId);
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(400).send("user not available");

    const product = await Product.findOne({ _id: prodId });
    if (!product) return res.status(400).send("product not available");

    user.wishlist.push(prodId);
    user.save();
    res.status(200).send("Added to Wishlsit");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

//removing from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userEmail, prodId } = req.params;
    console.log(req.params);
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(400).send("user not available");

    const product = await Product.findOne({ _id: prodId });
    if (!product) return res.status(400).send("product not available");

    user.wishlist.pull(prodId);
    user.save();

    res.status(200).send("Removed from Wishlsit");
  } catch (error) {
    res.status(500).json({ error: "An error occurred: " + error.message });
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
    res.status(200).send(data.wishlist);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addToWishlist,
  removeFromWishlist,
  viewAllWishlist,
};
