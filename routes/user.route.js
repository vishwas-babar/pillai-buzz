const express = require('express');
const router = express.Router();

const { handleCreateNewUser, handleGetUser, handlesignoutUser, handleGetUserInfo } = require('../controllers/user.controller.js');
const isUserAuthenticated = require('../middlewares/auth.js')

router.post('/login', handleGetUser);

router.post('/signup', handleCreateNewUser);

router.post('/signout', handlesignoutUser);

router.get('/info', isUserAuthenticated, handleGetUserInfo);

module.exports = router;