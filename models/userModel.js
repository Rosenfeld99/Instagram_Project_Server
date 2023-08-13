const mongoose = require("mongoose");
const Joi = require("joi");
// ספרייה שיודעת לייצר ולנהל טוקנים
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema(
  {
    profileImage: String,
    adentification: String,
    email: String,
    phone: String,
    fullname: String,
    password: String,
    birthday: String,
    username: String,
    bio: String,
    category: String,
    website: String,
    role: { type: String, default: "user" },
    gender: { type: String, default: "" },
    following: [String],
    followers: [String],
    posts: [
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
        name: String,
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
  // מייצרים טוקן
  // פרמטר ראשון התכולה של הטוקן ,כרגע איי די בהמשך יהיה גם רול/תפקיד
  // פרמטר שני - מילה סודית בשביל לפענח את הטוקן
  // פרמטר שלישי תוקף הטוקן
  const token = jwt.sign({ _id: user_id, role }, config.TOKEN_SECRET, {
    expiresIn: "60000mins",
  });
  return token;
};

exports.validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    profileImage: Joi.string().uri(),
    adentification: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    fullname: Joi.string().min(2).max(150).required(),
    password: Joi.string().min(6).max(150).required(),
    birthday: Joi.date().required(),
    username: Joi.string().required(),
    bio: Joi.string(),
    category: Joi.string(),
    website: Joi.string().uri(),
    gender: Joi.string().allow(null || ""),
    following: Joi.array().items(Joi.string()),
    followers: Joi.array().items(Joi.string()),
    posts: Joi.array().items(
      Joi.object({
        images: Joi.array().items(
          Joi.object({
            url: Joi.string().uri(),
            alt: Joi.string(),
          })
        ),
        comments: Joi.array().items(Joi.string()),
        likes: Joi.array().items(Joi.string()),
      })
    ),
    highlights: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        url: Joi.string().uri(),
      })
    ),
    stories: Joi.array().items(
      Joi.object({
        url: Joi.string().uri(),
        alt: Joi.string(),
        name: Joi.string(),
      })
    ),
    reels: Joi.array().items(
      Joi.object({
        images: Joi.array().items(
          Joi.object({
            url: Joi.string().uri(),
            alt: Joi.string(),
          })
        ),
        comments: Joi.array().items(Joi.string()),
        likes: Joi.array().items(Joi.string()),
      })
    ),
    saved: Joi.array().items(
      Joi.object({
        images: Joi.array().items(
          Joi.object({
            url: Joi.string().uri(),
            alt: Joi.string(),
          })
        ),
        comments: Joi.array().items(Joi.string()),
        likes: Joi.array().items(Joi.string()),
      })
    ),
  });

  return joiSchema.validate(_reqBody);
};

exports.validateEditUser = (_reqBody) => {
  const joiSchema = Joi.object({
    profileImage: Joi.string().uri(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    fullname: Joi.string().min(2).max(150),
    password: Joi.string().min(3).max(150),
    birthday: Joi.date(),
    username: Joi.string(),
    bio: Joi.string(),
    category: Joi.string(),
    website: Joi.string().uri(),
    gender: Joi.string().allow(null || ""),
    role: Joi.string(),
  });

  return joiSchema.validate(_reqBody);
};

exports.validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(200).email().required(),
    password: Joi.string().min(3).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
};
