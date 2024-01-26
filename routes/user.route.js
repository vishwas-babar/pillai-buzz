const express = require('express');
const router = express.Router();

const { handleCreateNewUser } = require('../controllers/user.controller.js');

router.route('/')
    // .get(handleCreateNewUser)
    .post(handleCreateNewUser)

module.exports = router;