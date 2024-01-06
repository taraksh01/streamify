import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    if (result) {
      fs.unlinkSync(filePath); // delete the file from the server after uploading to cloudinary
      console.log("File uploaded to cloudinary", result);
      return result;
    }
  } catch (error) {
    fs.unlinkSync(filePath); // delete the file from the server after uploading to cloudinary
    console.log("Error in uploading to cloudinary");
    console.log(error);
    return error;
  }
};
