const express = require('express');
const path = require('path');
const router = express.Router();

const isUserAuthenticated = require('../middlewares/auth.js');

router.get('/',isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/myprofile', isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/myprofile.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login_signup.html'));
});

router.get('/editor', isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editor.html'));
});

router.get('/post/:id', isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/post.html'));
})

router.get('/profile/:_id', isUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/profile.html'));
})

// router.get('/post/:id', isUserAuthenticated, handleGetSpecificPost);

module.exports = router;