const mongoose = require('mongoose');


const notificationsSchema = mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: ""
        },
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: ""
        },
        notificationType: {
            type: String,
            enum: ["following", "createPost", "likePost", "likeComment"]
        },
        readStatus: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
)

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
            trim: true,
        },
        profilePhoto: {
            type: String,
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
        notifications: [notificationsSchema],
    },
    { timestamps: true}
);


const User = mongoose.model('User', userSchema);
module.exports = User;