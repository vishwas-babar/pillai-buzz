const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const User = require('../models/user.model.js');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary.js');
const removeTheFileFromServer = require('../utils/filehandle.js');
const asynchandler = require('../utils/asynchandler.js');


const handleUploadFileToCloudinary = asynchandler(async (req, res) => {

    console.log('uploaded file: ', req.file); // when we use upload.single('name') from multer then it store this single file req.file

    const localImagePath = req.file?.path;
    if (!localImagePath) throw new ApiError(400, "does not get the localpath for the image!");

    const upload = await uploadToCloudinary(localImagePath)
    if (!upload) throw new ApiError(500, "failed to upload image to cloudinary");


    res.status(200).json(new ApiResponse(
        200,
        "image uploaded to cloudinary",
        {
            url: upload.secure_url
        }
    ))
})

const handleDeleteImageFromCloudinary = asynchandler(async () => {

    const imageId = req.params?.imageid;
    const deleted = await deleteFromCloudinary(imageId);
    
    if(deleted) {
        res.status(200).json(new ApiResponse(200, "image removed", { success: true }))
    }else{
        throw ApiError(500, "file is not deleted")
    }
})


module.exports = {
    handleUploadFileToCloudinary,
    handleDeleteImageFromCloudinary,
}