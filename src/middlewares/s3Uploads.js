import Aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const s3 = new Aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

const s3Upload = async (originalname, body) => {
  const uniqueSuffix = Date.now(); // give the unique nam
  let ext = originalname.substring(
    originalname.lastIndexOf("."),
    originalname.length
  ); // extention from original name

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueSuffix + ext,
        Body: body,
      },
      async (error, data) => {
        if (error) {
          console.log("S3 Error -", error.message);
          reject(error);
        }
        resolve(data);
      }
    );
  });
};

export default s3Upload;
