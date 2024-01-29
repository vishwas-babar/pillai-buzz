const express = require('express');
const router = express.Router();

const { handleCreateNewUser, handleGetUser, handlesignoutUser } = require('../controllers/user.controller.js');

router.post('/login', handleGetUser);

router.post('/signup', handleCreateNewUser);

router.post('/signout', handlesignoutUser);

module.exports = router;