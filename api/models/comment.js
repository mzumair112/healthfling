// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Comment', new Schema({
    body: String,
    email: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
    status: String,
    files: [
        {
            url: String,
            public_id: String,
            version: String,
            signature: String,
            width: String,
            height: String,
            format: String,
            resource_type: String,
            created_at: String,
            bytes: String,
            tags: [],
            etag: String,
            placeholder: String,
            secure_url: String
        }
    ],
    embed: String,
    like: {
      type: Number,
      default: 0
    },
    dislike: {
      type: Number,
      default: 0
    },
    flagreason: String,
    created: {
        type: Date,
        default: Date.now
    }
}));
