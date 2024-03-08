import "dotenv/config";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localPath: string, folder: string) => {
  try {
    if (!localPath) {
      console.log("Local path is required");
    }
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
      folder,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    fs.unlinkSync(localPath);
    return response;
  } catch (error: any) {
    fs.unlinkSync(localPath);
    console.log(`Error while uploading on cloudinary ${error.message}`);
    throw error;
  }
};

export const deleteFromCloudinary = async (public_id: string) => {
  try {
    const response = await cloudinary.uploader
      .destroy(public_id)
      .then((_data) => {
        console.log("Successfully deleted old image");
      })
      .catch((error) => {
        console.log(
          `Error while deleting image from cloudinary ${error.message}`
        );
      });
    return response;
  } catch (error: any) {
    console.log(`Error while deleting image from cloudinary ${error.message}`);
    process.exit(1);
  }
};
