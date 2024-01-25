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
      console.log("File uploaded to cloudinary", result.url);
      return result;
    }
  } catch (error) {
    fs.unlinkSync(filePath); // delete the file from the server after uploading to cloudinary
    console.log("Error in uploading to cloudinary");
    console.log(error);
    return error;
  }
};

const deleteOnCloudinary = async (publicId, resource = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource,
    });
    return result;
  } catch (error) {
    console.log("Error in deleting from cloudinary");
    console.log(error);
    return error;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
