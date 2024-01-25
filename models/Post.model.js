const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        heading: {
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
        likes: {
            type: Number,
            default: 0,
        },
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
    { timestamps: true}
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;