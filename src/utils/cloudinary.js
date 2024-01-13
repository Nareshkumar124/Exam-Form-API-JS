import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloud = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload file on cloud
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        //file has been uploded successfully i thin he forget to unlink a file
        console.log("Upload file success fully", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath); //remove file from system when upload fail
        return null;
    }
};


export { uploadOnCloud };
