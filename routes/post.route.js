const express = require('express');

const {
    handleCreatePost,
    handleGetSpecificPost,
    handleLikePost,
    handleAddCommentOnPost,
    handleGetAllCommentsOnThePost,
    handleBookmarkPost,
    handleLikeTheComment,
    handleLoadPostForHomePage,
    handleGetUserPosts
} = require('../controllers/post.controller.js');

const router = express.Router();

router.get('/load', handleLoadPostForHomePage);

router.post('/create', handleCreatePost);

router.get('/:id', handleGetSpecificPost);

router.post('/:id/like', handleLikePost);

router.post('/:id/addcomment', handleAddCommentOnPost);

router.get('/:id/comments', handleGetAllCommentsOnThePost);

router.post('/:id/bookmark', handleBookmarkPost);

router.post('/:postId/likethecomment/:commentId', handleLikeTheComment);

router.get('/userposts/:user_id', handleGetUserPosts);

module.exports = router;