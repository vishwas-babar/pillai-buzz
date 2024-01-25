const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        tagName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }],
    }
)