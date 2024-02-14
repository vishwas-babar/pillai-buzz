const express = require('express');
const router = express.Router();

const {
    handleCreateNewUser,
    handleGetUser,
    handlesignoutUser,
    handleGetMyInfo,
    handleGetUserInfo,
    handleUploadProfilePhoto,
} = require('../controllers/user.controller.js');
const isUserAuthenticated = require('../middlewares/auth.js');
const upload = require('../middlewares/multer.js');

router.post('/login', handleGetUser);

router.post('/signup', handleCreateNewUser);

router.post('/addprofilephoto', upload.fields([
    {
        name: "profilePhoto",
        maxCount: 1
    }
]), handleUploadProfilePhoto)

router.post('/signout', handlesignoutUser);

router.get('/info', isUserAuthenticated, handleGetMyInfo);

router.get('/profile/:_id', handleGetUserInfo);

module.exports = router;