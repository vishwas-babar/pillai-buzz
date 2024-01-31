const express = require('express');

const {handleCreatePost, handleGetSpecificPost} = require('../controllers/post.controller.js');

const router = express.Router();

router.post('/', handleCreatePost);

router.get('/:id', handleGetSpecificPost);

module.exports = router;