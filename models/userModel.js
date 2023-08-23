const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "",
    },
    adentification: String,
    email: String,
    phone: String,
    fullname: String,
    password: String,
    birthday: {
      day: {
        name: String,
      },
      month: {
        name: String,
      },
      year: {
        name: String,
      },
    },
    username: String,
    bio: { type: String, default: "" },
    category: { type: String, default: "" },
    website: { type: String, default: "" },
    role: { type: String, default: "user" },
    gender: { type: String, default: "Prefer not to say" },
    theme: { type: String, default: "light" },
    notification: { type: Number, default: 0 },
    following: [Object],
    followers: [Object],
    posts: [
      {
        images: [
          {
            url: String,
            alt: String,
          },
        ],
        description: { type: String, default: "" },
        comments: [String],
        likes: [String],
      },
    ],
    highlights: [
      {
        name: String,
        url: String,
      },
    ],
    stories: [
      {
        url: String,
        alt: String,
        // name: String,
        created: { type: Date, default: Date.now },
      },
    ],
    reels: [
      {
        images: [
          {
            url: String,
            alt: String,
          },
        ],
        comments: [String],
        likes: [String],
      },
    ],
    saved: [
      {
        images: [
          {
            url: String,
            alt: String,
          },
        ],
        comments: [String],
        likes: [String],
      },
    ],
  },
  { timestamps: true }
);

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (user_id, role = "user") => {
  const token = jwt.sign({ _id: user_id, role }, config.TOKEN_SECRET, {
    expiresIn: "60000mins",
  });
  return token;
};
