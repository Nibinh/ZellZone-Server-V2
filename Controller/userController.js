const User = require("../Models/users");
const bucketName = process.env.BUCKET_NAME;
const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../Services/AWS-S3");
const bcrypt = require("bcryptjs");
const { getImageUrlFromS3 } = require("../Services/AWS-getImage");

//getting a particular one
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const data = await User.findOne({ email: id }).populate({
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

//getting all users
const gettingAllUsers = async (req, res) => {
  try {
    const data = await User.find().select("-password");
    if (!data) res.status(400).send("No users");
    for (let post of data) {
      const param = {
        Bucket: bucketName,
        Key: post.imageName,
      };
      const command = new GetObjectCommand(param);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      post.imageUrl = url;
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

//edit user
const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, confirmPassword, phonenumber, address } = req.body;

    const newImageName = req.file.key;

    const isExisting = await User.findOne({ _id: id });
    if (!isExisting) return res.status(400).send("User not found");

    if (password !== confirmPassword)
      return res.status(400).send("password and ConfirmPassword dosent match");
    //Hashing password.
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //deleting image if image is updated
    if (newImageName) {
      const deleteParam = {
        Bucket: bucketName,
        Key: isExisting.imageName,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParam));
      const updatedData = await User.updateOne(
        { _id: id },
        {
          $set: {
            name,
            imageName: newImageName,
            password: hashPassword,
            phonenumber,
            address,
          },
        }
      );
      res.status(200).json({ message: "updated", data: updatedData });
    } else {
      const updatedData = await User.updateOne(
        { _id: id },
        { $set: { name, password: hashPassword, phonenumber, address } }
      );
      res.status(200).send(updatedData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};

module.exports = {
  getUser,
  gettingAllUsers,
  editUser,
};
