const Admin = require("../Models/admin");
const User = require("../Models/users");
const Product = require("../Models/products");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
const bucketName = process.env.BUCKET_NAME;
const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../Services/AWS-S3");
const { getImageUrlFromS3 } = require("../Services/AWS-getImage");

//AdminRegistration
const AdminRegistration = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    const isExisting = await Admin.findOne({ email: email });
    if (isExisting) return res.status(400).send("Email is already registred");

    if (!email || !name || !password || !confirmPassword)
      return res.status(400).send("fill all feilds");

    if (password !== confirmPassword)
      return res.status(400).send("password and confirmPassword dosent match");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const data = await Admin.create({
      email,
      name,
      password: hashPassword,
    });
    res.status(200).send("AccountCreated");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error occurred" + error.message });
  }
};

//AdminLogin
const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("fll all feilds");

    const data = await Admin.findOne({ email });
    if (!data) return res.status(400).send("Invalid Credentials");

    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) return res.status(400).send("Invalid Credentials");
    console.log("jwt", JWT_KEY);
    const adminToken = JWT.sign({ email: data.email }, JWT_KEY, {
      expiresIn: "2hr",
    });
    console.log(JWT_KEY);
    if (!adminToken) return res.status(400).send("token not generated");

    res
      .cookie("adminToken", adminToken, { httpOnly: true })
      .status(200)
      .json({ message: "login Successfull", email: data.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

//getting a particular one
const getUserAdmin = async (req, res) => {
  try {
    const { email } = req.params;

    const data = await User.findOne({ email: email }).populate({
      path: "soldProducts",
    });
    if (!data) return res.status(400).send("User not found");
    // aws
    const param = {
      Bucket: bucketName,
      Key: data.imageName,
    };
    const command = new GetObjectCommand(param);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    data.imageUrl = url;
    //aws for soldProducts
    for (let product of data.soldProducts) {
      if (product.imageName) {
        const imageurl = await getImageUrlFromS3(product.imageName);
        product.imageUrl = imageurl;
      }
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

//deleting a user
const AdminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).populate({
      path: "soldProducts",
    });
    if (!user) return res.status(400).send("not found");

    //product Section
    for (let products of user.soldProducts) {
      //aws sectoion
      const param = {
        Bucket: bucketName,
        Key: products.imageName,
      };
      const command = new DeleteObjectCommand(param);
      await s3Client.send(command);

      const product = await Product.deleteOne({ _id: products._id });
      console.log(product);
    }
    //user section
    const param = {
      Bucket: bucketName,
      Key: user.imageName,
    };
    const command = new DeleteObjectCommand(param);
    await s3Client.send(command);

    const deleteUser = await User.deleteOne({ _id: id });
    res.status(200).send(deleteUser);
    console.log("done");
  } catch (error) {
    console.log();
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

//Admin Veiw NONActive Products
const getNonActiveProducts = async (req, res) => {
  try {
    const active = await Product.find({ active: false }).populate({
      path: "sellerId",
    });

    for (let product of active) {
      console.log(product.imageName);
      const url = await getImageUrlFromS3(product.imageName);
      product.imageUrl = url;
    }
    res.status(200).send(active);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

//admin activating products
const activatingProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.updateOne(
      { _id: id },
      { $set: { active: true } }
    );
    res.status(200).json({ message: "Product Activated " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

//Admin veiw particular product
const adminVeiwProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id }).populate({
      path: "sellerId",
      select: "email address name phonenumber",
    });

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
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

module.exports = {
  AdminRegistration,
  AdminLogin,
  getUserAdmin,
  AdminDeleteUser,
  getNonActiveProducts,
  activatingProducts,
  adminVeiwProduct,
};
