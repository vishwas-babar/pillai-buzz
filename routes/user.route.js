const express = require('express');
const router = express.Router();

const {
    handleCreateNewUser,
    handleGetUser,
    handlesignoutUser,
    handleGetMyInfo,
    handleGetUserInfo,
    handleUploadProfilePhoto,
    handleGetCurrentUser,
    handleGetUserData,
    handleNotificationOnOffToggle,
    handleGetNotifications,
} = require('../controllers/user.controller.js');
const isUserAuthenticated = require('../middlewares/auth.js');
const upload = require('../middlewares/multer.js');
const passport = require('../middlewares/passport.js');

router.post('/login', handleGetUser);

router.post('/signup', upload.single('profilePhoto'), handleCreateNewUser);

router.post('/addprofilephoto', upload.fields([
    {
        name: "profilePhoto",
        maxCount: 1
    }
]), handleUploadProfilePhoto)

router.post('/signout', handlesignoutUser);

router.get('/info', isUserAuthenticated, handleGetMyInfo);

router.post('/notification-toggle', isUserAuthenticated, handleNotificationOnOffToggle);

router.get('/get-current-user', isUserAuthenticated, handleGetCurrentUser);

router.get('/get-notifications', isUserAuthenticated, handleGetNotifications);

router.post('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // successfull authentication, redirect home or return res
        return res.status(201).json({ msg: "created new account with google" })
    }
)

router.get('/:_id/get-details', isUserAuthenticated, handleGetUserData);

router.get('/profile/:_id', handleGetUserInfo);

module.exports = router;