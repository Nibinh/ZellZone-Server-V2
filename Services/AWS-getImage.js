const bucketName = process.env.BUCKET_NAME;
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("./AWS-S3");

async function getImageUrlFromS3(key) {
  const param = {
    Bucket: bucketName,
    Key: key,
  };
  try {
    const command = new GetObjectCommand(param);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getImageUrlFromS3 };
