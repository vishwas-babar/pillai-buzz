const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }]
    },
    { timestamps: true }
)

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        discription: {
            type: String,
            required: true,
        },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        reads: {
            type: Number,
            default: 0,
        },
        comments: [commentsSchema],
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;