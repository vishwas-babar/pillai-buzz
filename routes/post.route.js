const express = require('express');

const {
    handleCreatePost,
    handleGetSpecificPost,
    handleLikePost,
    handleAddCommentOnPost,
    handleGetAllCommentsOnThePost
} = require('../controllers/post.controller.js');

const router = express.Router();

router.post('/', handleCreatePost);

router.get('/:id', handleGetSpecificPost);

router.post('/:id/like', handleLikePost);

router.post('/:id/addcomment', handleAddCommentOnPost);

router.get('/:id/comments', handleGetAllCommentsOnThePost);

module.exports = router;