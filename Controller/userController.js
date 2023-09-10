const User = require("../Models/users");
const bucketName = process.env.BUCKET_NAME;
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../Services/AWS-S3");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findOne({ _id: id }).select("-password");
    if (!data) return res.status(400).send("User not found");
    const param = {
      Bucket: bucketName,
      Key: data.imageName,
    };
    const command = new GetObjectCommand(param);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    data.imageUrl = url;
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUser,
};
