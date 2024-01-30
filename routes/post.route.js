const express = require('express');

const {handleCreatePost} = require('../controllers/post.controller.js');

const router = express.Router();

router.post('/', handleCreatePost);

module.exports = router;