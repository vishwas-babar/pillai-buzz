const Post = require('../models/Post.model.js');
const User = require('../models/user.model.js');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { json } = require('body-parser');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asynchandler = require('../utils/asynchandler.js');
const uploadToCloudinary = require('../utils/cloudinary.js');
const removeTheFileFromServer = require('../utils/filehandle.js');

// not used error and response class
async function handleCreatePost(req, res) {
    console.log('inside the handlecreatenewpost controller')
    console.log("req.user: ", req.user);
    console.log("req.body: ", req.body)

    // check if user is awailable in body or not
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }


    // get title and description from body
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({
            message: 'Invalid request',
        });
    }


    // upload to clodinary
    const coverImageLocalPath = req.file?.path;

    // check if proper image is provided or its other type of files
    // if given file is not image then reject request
    if (!req.file.mimetype.startsWith('image/')) { 
        removeTheFileFromServer(coverImageLocalPath);
        return res.status(400).json({
            msg: "Please upload image and not the other files"
        })
    }

    if (!coverImageLocalPath) {
        return res.status(400).json({
            msg: "cover photo is required"
        })
    }

    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    if(!coverImage) {
        return res.status(500).json({
            msg: "failed to upload cover image to cloudinary"
        })
    }


    try {
        const userindb = await User.findOne({ _id: user._id });

        const newPost = await Post.create({
            author: userindb._id,
            title: title,
            discription: description,
            coverImage: coverImage.secure_url
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

// not used error and response class
const handleGetSpecificPost = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: 'Invalid request',
        });
    }

    try {
        const post = await Post.findById(id);
        const author = await User.findById(post.author).select('createdAt name userId _id profilePhoto');

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

// not used error and response class
const handleLikePost = async (req, res) => {
    const postId = req.params.id;
    const user = req.user;

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

// not used error and response class
const handleAddCommentOnPost = async (req, res) => {
    const postid = req.params.id;
    const userid = req.user._id;
    const content = req.body.content;

    console.log(req.body);

    // check if post and this user exist 
    let post_indb;
    let user_indb;
    try {
        post_indb = await Post.findById(postid).select('author title reads createdAt');
        user_indb = await User.findById(userid).select('userId name profilePhoto');
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

// not used error and response class
const handleGetAllCommentsOnThePost = async (req, res) => {

    const postid = req.params.id;
    const userid = req.user._id;

    try {
        // now check if post exist or not
        // const post = await Post.findById(postid).select('comments');

        // now check if post exist or not
        const post1 = await Post.findById(postid).select('author reads');
        console.log(post1);
        const comments = await Post.aggregate([
            {
                $match: {
                    _id: new ObjectId(postid)
                }
            },
            {
                $unwind: "$comments",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.createdBy",
                    foreignField: "_id",
                    as: "comment_author_info",
                },
            },
            {
                $unwind: {
                    path: "$comment_author_info",
                },
            },
            {
                $addFields: {
                    likeCount: {
                        $size: "$likes",
                    },
                    "comments.authorName": "$comment_author_info.name", // Add author name to each comment
                    "comments.authorUserId": "$comment_author_info.userId",   // Add author id to each comment
                    "comments.authorProfilePhoto": "$comment_author_info.profilePhoto",   // Add author id to each comment
                },
            },

            {
                $project: {
                    likesCount: 1,
                    comments: 1, // Include the comments array in the final projection
                },
            },
        ]);

        console.log(comments)

        if (!comments) {
            return res.status(404).json({
                msg: "post not found"
            })
        }

        return res.status(200).json({
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

// not used error and response class
const handleBookmarkPost = async (req, res) => {

    const user_id = req.user._id;
    const post_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(user_id) || !mongoose.Types.ObjectId.isValid(post_id)) {
        return res.status(400).json({
            msg: "invalid user id or post id"
        })
    }

    // 

    try {
        const user = await User.findByIdAndUpdate(user_id, {
            $push: {
                bookmarks: post_id
            }
        }, { new: true })

        if (!user) {
            return res.status(500).json({
                msg: "iternal server error"
            })
        }

        return res.status(200).json({
            msg: "bookmarked successfully",

        })
    } catch (error) {
        return res.status(500).json({
            msg: "internal server error",
            error: error,
        })
    }
}

// not used error and response class
const handleLikeTheComment = async (req, res) => {
    const post_id = req.params.postId;
    const comment_id = req.params.commentId;
    const user_id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(post_id) || !mongoose.Types.ObjectId.isValid(comment_id) || !mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({
            msg: "invalid user id or post id or comment id"
        })
    }

    try {
        const post = await Post.findOneAndUpdate(
            { _id: post_id, "comments._id": comment_id },
            { $push: { "comments.$.likes": user_id } }, // add to set only add the different values  if the given value is already exist in array then it avoids to add it in database
            { new: true } // returns updated document
        );

        const comments = post.comments;
        let targetComment;
        for (let i = 0; i < comments.length; i++) {
            const element = comments[i];

            if (element._id == comment_id) { // using it for the searching target comment
                targetComment = element;
            }
        }

        if (!targetComment) {
            return res.status(500).json({
                msg: "failed to find target comment",
            })
        }

        const commentLikes = targetComment.likes.length;

        return res.status(200).json({
            msg: "like added succesfully",
            commentLikesCount: commentLikes,
        });
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            msg: "failed to like the comment",
            error: error
        })
    }
}

// not used error and response class
const handleLoadPostForHomePage = async (req, res) => {

    console.log(req.query);
    const page = parseInt(req.query.page);
    const postsPerPage = parseInt(req.query.postsPerPage);

    const skip = postsPerPage * page;
    console.log(skip);

    const posts = await Post.aggregate([
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: postsPerPage,
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails",
            },
        },
        { $unwind: "$authorDetails" },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                commentsCount: {
                    $size: "$comments"
                }
            },
        },
        {
            $project: {
                "authorDetails.name": 1,
                "authorDetails.userId": 1,
                "authorDetails._id": 1,
                "authorDetails.profilePhoto": 1,
                title: 1,
                reads: 1,
                coverImage: 1,
                createdAt: 1,
                likesCount: 1,
                commentsCount: 1,
                _id: 1,
            },
        },
    ]);

    // console.log(posts)

    res.json({
        msg: "backend connected",
        posts: posts
    })
}

// not used error and response class
const handleGetUserPosts = async (req, res) => {

    const user_id = req.params.user_id;

    if (!user_id) {
        return res.status(400).json({
            msg: "_id is required"
        });
    }


    try {

        // mongodb aggregation pipeline
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            { $unwind: "$authorDetails" },
            {
                $match: {
                    "authorDetails._id": new ObjectId(user_id)
                },
            },

            {
                $addFields: {
                    likesCount: {
                        $size: "$likes",
                    },
                    commentsCount: {
                        $size: "$comments",
                    },
                },
            },

            {
                $project: {
                    _id: 1,
                    title: 1,
                    coverImage: 1,
                    createdAt: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    reads: 1,
                    "authorDetails.userId": 1,
                    "authorDetails.name": 1,
                    "authorDetails._id": 1,
                    "authorDetails.profilePhoto":1,
                }
            }
        ])

        if(posts.length == 0){ // == is loose equality operator and === strict equality operator 
            return res.status(200).json({
                msg: "this user has no posts yet",
                posts: posts,
            })
        }

        res.status(200).json({
            msg: "user posts sent successfully",
            posts: posts,
        })
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: "invalid given id or internal server error",
            error: error
        })
    }

}

const uploadImageFromPostEditor = asynchandler( async (req, res) => {
    // write your logic here
    console.log('got the request at upload image from post editor controller');

    console.log('uploaded file: ', req.file); // when we use upload.single('name') from multer then it store this single file req.file
    
    const uploadLocalPath = req.file?.path;
    if(!uploadLocalPath) {
        throw new ApiError(400, "does not get any local path or image is not provided");
    }

    const upload = await uploadToCloudinary(uploadLocalPath);
    if(!upload){
        throw new ApiError(500, "failed to add image on cloudinary");
    }

    return res.status(200).json({
        uploaded: true,
        url: upload.secure_url
    })

});

module.exports = {
    handleCreatePost,
    handleGetSpecificPost,
    handleLikePost,
    handleAddCommentOnPost,
    handleGetAllCommentsOnThePost,
    handleBookmarkPost,
    handleLikeTheComment,
    handleLoadPostForHomePage,
    handleGetUserPosts,
    uploadImageFromPostEditor
};