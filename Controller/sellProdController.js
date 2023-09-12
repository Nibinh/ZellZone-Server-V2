const User = require("../Models/users");
const Product = require("../Models/products");
const { getImageUrlFromS3 } = require("../Services/AWS-getImage");
const { deleteProduct } = require("./productController");

const viewAllSellProd = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).populate({
      path: "soldProducts",
    });
    if (!user) return res.status(400).send("User not found");

    for (let product of user.soldProducts) {
      if (product.imageName) {
        const imageurl = await getImageUrlFromS3(product.imageName);
        product.imageUrl = imageurl;
      }
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  viewAllSellProd,
};
