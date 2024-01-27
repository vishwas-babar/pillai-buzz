const Post = require('../models/Post.model.js');
const User = require('../models/user.model.js');

async function handleCreatePost(req, res) {

    const user = req.body.user;
    console.log(user);
    if(!user) {
        return res.status(401).json({
            message: 'Unauthorized',
        }); 
    }

    const { title, discription } = req.body;
    console.log(user);

    if (!title || !discription) {
        return res.status(400).json({
            message: 'Invalid request',
        });
    }

    const userindb = await User.findOne({ _id: user._id });

    try {
        await Post.create({
            author: userindb._id,
            title: title,
            discription: discription,
        });

        return res.status(200).json({
            message: 'Post created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}

module.exports = handleCreatePost;