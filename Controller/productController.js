const Product = require("../Models/products");
const User = require("../Models/users");
const bucketName = process.env.BUCKET_NAME;
const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../Services/AWS-S3");

//adding a product
const addProduct = async (req, res) => {
  try {
    const { productName, type, productAge, price, description, sellerId } =
      req.body;
    if (
      !productName ||
      !type ||
      !productAge ||
      !price ||
      !description ||
      !sellerId
    )
      return res.status(400).send("Fill all Feilds");

    const isExisting = await User.findOne({ _id: sellerId });
    if (!isExisting) return res.status(200).send("User not found");

    const addedProduct = await Product.create({
      productName,
      type,
      productAge,
      price,
      description,
      imageName: req.file.key,
      sellerId,
    });
    console.log(addedProduct._id);

    const user = await User.findOne({ _id: sellerId });
    user.soldProducts.push(addedProduct._id);
    user.save();

    res.status(200).send("Product is added");
  } catch (error) {
    console.log(error);
  }
};

//viewParticularProduct
const veiwProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!product) return res.status(400).send("Product not Found");
    //aws
    const param = {
      Bucket: bucketName,
      Key: product.imageName,
    };
    const command = new GetObjectCommand(param);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    product.imageUrl = url;
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
  }
};

//getting all Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) return res.status(400).send("products not available");

    for (let product of products) {
      const param = {
        Bucket: bucketName,
        Key: product.imageName,
      };
      const command = new GetObjectCommand(param);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      product.imageUrl = url;
    }
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Product.findByIdAndRemove({ _id: id });
    if (!data) return res.status(400).send("Product not Found");

    const param = {
      Bucket: bucketName,
      Key: data.imageName,
    };
    const command = new DeleteObjectCommand(param);
    await s3Client.send(command);

    const user = await User.findOne({ _id: data.sellerId });
    user.soldProducts.pull(id);
    user.save();
    res.status(200).send("DELETED");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addProduct,
  veiwProduct,
  getAllProducts,
  deleteProduct,
};
