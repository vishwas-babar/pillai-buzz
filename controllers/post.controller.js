const Post = require('../models/Post.model.js');
const User = require('../models/user.model.js');
const mongoose = require('mongoose');

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

    try {
        const post = await Post.findById(id);
        const author = await User.findById(post.author).select('createdAt name userId _id');
        console.log(post.likes.length)

        res.status(200).json({
            likesCount: post.likes.length,
            author: author,
            postContent: post
        })

    } catch (error) {
        res.status(404).json({
            msg: "not found"
        })
    }

}

const handleLikePost = async (req, res) => {
    const postId = req.params.id;
    const user = req.body.user;

    try {

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                msg: "Post not found"
            })
        }


        const updatedPost = await Post.findByIdAndUpdate(postId, {
            $push: { likes: user._id }
        }, { new: true }).select('likes');


        return res.status(200).json({
            likesCount: updatedPost.likes.length,
            msg: "like added",
        });
    } catch (error) {
        return res.status(500).json({
            msg: "internal server error"
        })
    }
}

const handleAddCommentOnPost = async (req, res) => {
    const postid = req.params.id;
    const userid = req.body.user._id;
    const content = req.body.content;

    console.log(req.body);

    // check if post and this user exist 
    let post_indb;
    let user_indb;
    try {
        post_indb = await Post.findById(postid).select('author title reads createdAt');
        user_indb = await User.findById(userid).select('userId name');
    } catch (error) {
        return res.status(500).json({
            msg: "internal server error"
        })
    }

    try {
        // push the comment to object array of comments
        const updatedPost = await Post.findByIdAndUpdate(postid, {
            $push: {
                comments: {
                    content: content,
                    createdBy: userid,
                }
            }
        }, { new: true }).select('comments reads')


        const newComment = updatedPost.comments[updatedPost.comments.length - 1]; // get the last created post

        return res.status(200).json({
            msg: "comment added succefully",
            author: user_indb,
            comment: newComment,
        })
    } catch (error) {
        return res.status(500).json({
            msg: "internal server error"
        })
    }
}


const handleGetAllCommentsOnThePost = async (req, res) => {

    const postid = req.params.id;
    const userid = req.body.user._id;

    try {
        // now check if post exist or not
        // const post = await Post.findById(postid).select('comments');

        // now check if post exist or not
        const post1 = await Post.findById(postid).select('author reads');
        console.log(post1);
        const post = await Post.aggregate([
            { $match: { _id: postid } },
            { $unwind: "$comments" },
            {
                $lookup: {
                    from: "users", // replace with your User collection name
                    localField: "comments.createdBy", // replace with the field name in comments that stores user id
                    foreignField: "_id", // field name in the users collection that corresponds to the user id
                    as: "user_info" // output array where the joined document(s) will be placed
                }
            },
            {
                $project: {
                    "comments.content": 1,
                    "comments._id": 1,
                    "comments.likes": 1,
                    "user_info.userId": 1,
                    "user_info.name": 1,
                    "user_info._id": 1
                }
            }
        ]);

        console.log('post: ', post)
        if (!post) {
            return res.status(404).json({
                msg: "post not found"
            })
        }

        const comments = post.comments;

        return res.status(200).json({
            post: post,
            comments: comments,
            msg: "comments successfully sent"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "internal server error"
        })
    }
}

module.exports = {
    handleCreatePost,
    handleGetSpecificPost,
    handleLikePost,
    handleAddCommentOnPost,
    handleGetAllCommentsOnThePost
};