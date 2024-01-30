const express = require('express');
const path = require('path');
const router = express.Router();

const { handleGetSpecificPost } = require('../controllers/post.controller.js');
const isUserAuthenticated = require('../middlewares/auth.js');

router.get('/',isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/profile', isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/profile.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login_signup.html'));
});

router.get('/editor', isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editor.html'));
});

router.get('/post/:id', isUserAuthenticated, handleGetSpecificPost);

module.exports = router;