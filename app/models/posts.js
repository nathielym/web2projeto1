const mongoose = require('../../data/index');
const bcrypt = require('bcryptjs');

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;