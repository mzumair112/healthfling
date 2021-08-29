// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Reply', new Schema({
    body: String,
    email: String,
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
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
    flagreason: String,
    label: String,
    owner: String,
    like: {
      type: Number,
      default: 0
    },
    dislike: {
      type: Number,
      default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
}));
