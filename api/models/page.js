// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Page', new Schema({
    created: {
      type: Date,
      default: Date.now
    },
    title: {
        type: String,
        unique: true
    },
    url: {
        type: String,
        unique: true
    },
    description: String,
    location: String,
    website: String,
    profilePic: String,
    coverPic: String,
    subscribers: [],
    status: String,
    email: String,
    reportreason: String,
    like: {
      type: Number,
      default: 0
    },
    dislike: {
      type: Number,
      default: 0
    }
}));
