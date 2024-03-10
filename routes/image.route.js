const express = require('express');
const upload = require('../middlewares/multer.js');
const { 
    handleUploadFileToCloudinary,
    handleDeleteImageFromCloudinary
 } = require('../controllers/image.controller.js')
const router = express.Router();

router.post('/add', handleUploadFileToCloudinary);

router.delete('/delete/:imageid', handleDeleteImageFromCloudinary)


module.exports = router;