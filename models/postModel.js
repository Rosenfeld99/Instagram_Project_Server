// postModel.js
const mongoose = require("mongoose");

const postModel = new mongoose.Schema({
  images: [
    {
      url: String,
      alt: String,
    },
  ],
  description: { type: String, default: "" },
  comments: [
    {
      username: String,
      profileImage: String,
      time: Date,
      comment: String,
    },
  ],
  likes: [String],
});

module.exports = postModel;

// {
//   images: [
//     {
//       url: String,
//       alt: String,
//     },
//   ],
//   description: { type: String, default: "" },
//   comments: [
//     {
//       username: String,
//       profileImage: String,
//       time: Date,
//       comment: String,
//     },
//   ],
//   likes: [String],
// }
