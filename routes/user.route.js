const express = require('express');
const router = express.Router();

const { handleCreateNewUser, handleGetUser } = require('../controllers/user.controller.js');

router.post('/login', handleGetUser);

router.post('/signup', handleCreateNewUser);

module.exports = router;