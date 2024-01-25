const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        userType: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        subscribers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }],
        interests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
        }],
        bookmarks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }],
        notifications: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
    },
    { timestamps: true}
);


const User = mongoose.model('User', userSchema);
module.exports = User;