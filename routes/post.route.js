const express = require('express');

const upload = require('../middlewares/multer.js');
const {
    handleCreatePost,
    handleGetSpecificPost,
    handleLikePost,
    handleAddCommentOnPost,
    handleGetAllCommentsOnThePost,
    handleBookmarkPost,
    handleLikeTheComment,
    handleLoadPostForHomePage,
    handleGetUserPosts,
    uploadImageFromPostEditor,
    handleUpdateThePost,
    handleGetBookmarks,
    handleSearchPost,
} = require('../controllers/post.controller.js');
const isUserAuthenticated = require('../middlewares/auth.js');

const router = express.Router();

router.get('/load', isUserAuthenticated, handleLoadPostForHomePage);

router.post('/create', isUserAuthenticated, upload.single('coverImage'), handleCreatePost);

router.post('/create/uploadimage', isUserAuthenticated, upload.single('upload'), uploadImageFromPostEditor ); // using async handler

router.post('/update/:post_id', isUserAuthenticated, upload.single('coverImage'), handleUpdateThePost );

router.get('/get-bookmarks',isUserAuthenticated, handleGetBookmarks);

router.get('/search', handleSearchPost);

router.get('/:id', handleGetSpecificPost);

router.post('/:id/like', isUserAuthenticated, handleLikePost);

router.post('/:id/addcomment', isUserAuthenticated, handleAddCommentOnPost);

router.get('/:id/comments', isUserAuthenticated, handleGetAllCommentsOnThePost);

router.post('/:id/bookmark', isUserAuthenticated, handleBookmarkPost);

router.post('/:postId/likethecomment/:commentId', isUserAuthenticated, handleLikeTheComment);

router.get('/userposts/:user_id', isUserAuthenticated, handleGetUserPosts);


module.exports = router;