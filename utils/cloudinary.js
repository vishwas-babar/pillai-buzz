require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(buffer) {
    if (!buffer) return 'No file provided';

    try {
        const response = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });

        // console.log(response)
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId)
        return true;
    } catch (error) {
        console.log("failed to delete image from cloudinary")
        return false;
    }
}


module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};