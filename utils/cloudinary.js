require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(localPath) {

    if (!localPath) return 'can not find the path'

    try {
        const response = await cloudinary.uploader.upload( localPath, {
             resource_type: 'auto'
         } );

         console.log('uploaded succesfully');

         fs.unlinkSync(localPath);
         console.log(response)
         return response;
    } catch (error) {
        fs.unlinkSync(localPath);
        return null;
    }
}


module.exports = uploadToCloudinary;