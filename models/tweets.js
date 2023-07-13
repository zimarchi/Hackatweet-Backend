const mongoose = require('mongoose');

const tweetsSchema = mongoose.Schema({
  content: String,
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users'
    },
  timeStamp: Date,
  likes: Number,
  hashtags: Array,
  mentions: Array
});

const Tweet = mongoose.model('tweets', tweetsSchema);

module.exports = Tweet;