const express = require('express');
const router = express.Router();

const { handleCreateNewUser, handleGetUser } = require('../controllers/user.controller.js');

router.route('/')
    .get(handleGetUser)
    .post(handleCreateNewUser)

module.exports = router;