const express = require('express');

const {
    handleCreatePost,
    handleGetSpecificPost,
    handleLikePost
} = require('../controllers/post.controller.js');

const router = express.Router();

router.post('/', handleCreatePost);

router.get('/:id', handleGetSpecificPost);

router.post('/:id/like', handleLikePost);

module.exports = router;