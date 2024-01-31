const Post = require('../models/Post.model.js');
const User = require('../models/user.model.js');

async function handleCreatePost(req, res) {

    // check if user is awailable in body or not
    const user = req.body.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    // get title and description from body
    const { title, discription } = req.body;
    if (!title || !discription) {
        return res.status(400).json({
            message: 'Invalid request',
        });
    }

    
    try {
        const userindb = await User.findOne({ _id: user._id });

        const newPost = await Post.create({
            author: userindb._id,
            title: title,
            discription: discription,
        });

        // store the created post in author mypost list
        await User.findByIdAndUpdate(user._id, {
            $push: { posts: newPost._id }
        });

        return res.status(200).json({
            message: 'Post created successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}

const handleGetSpecificPost = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: 'Invalid request',
        });
    }

    console.log(id);

    try {
        const post = await Post.findById(id);
        const author = await User.findById(post.author).select('createdAt name userId _id');

        res.status(200).json({
            author: author,
            postContent: post
        })

    } catch (error) {
        res.status(404).json({
            msg: "not found"
        })
    }

}

module.exports = { handleCreatePost, handleGetSpecificPost };