// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Post', new Schema({
    title: String,
    country: String,
    state: String,
    region: String,
    city: String,
    zip: String,
    category: String,
    location: String,
    age: Number,
    body: String,
    email: String,
    status: String,
    haircolor: String,
    height: String,
    ethnicity: String,
    orientation: String,
    bodytype: String,
    eyecolor: String,
    mstatus: String,
    gender: String,
    bodyhair: String,
    hivstatus: String,
    flagreason: String,
    weight : Number,
    mage : Number,
    anonymouscomment: String,
    notified: String,
    share: String,
    embedSocial: [],
    sharedLink: Boolean,
    sharedData: {
        url: String,
        domain: String,
        title: String,
        description: String,
        image: String
    },
    embed: String,
    embedDescription: String,
    videoLike: {
      type: Number,
      default: 0
    },
    videoDislike: {
      type: Number,
      default: 0
    },
    files: [
        {
            secure_url: String,
            signature: String,
            url: String,
            public_id: String,
            version: String,
            width: String,
            height: String,
            format: String,
            resource_type: String,
            created_at: String,
            bytes: String,
            tags: [],
            etag: String,
            placeholder: String,
            like: {
              type: Number,
              default: 0
            },
            dislike: {
              type: Number,
              default: 0
            },
        }
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    page: { type: Schema.Types.ObjectId, ref: 'Page' },
    subscribers: [],
    like: {
      type: Number,
      default: 0
    },
    dislike: {
      type: Number,
      default: 0
    },
    reactions: {
      like: {
        type: Number,
        default: 0
      },
      love: {
        type: Number,
        default: 0
      },
      lol: {
        type: Number,
        default: 0
      },
      wow: {
        type: Number,
        default: 0
      },
      sad: {
        type: Number,
        default: 0
      },
      angry: {
        type: Number,
        default: 0
      },
    },
    created: {
        type: Date,
        default: Date.now
    }
}));
