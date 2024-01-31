const mongoose = require('mongoose');

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
        comments: [{
            content: {
                type: String,
                required: true,
                trim: true,
            },
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        }, { timestamps: true }],
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;