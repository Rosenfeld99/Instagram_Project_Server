const Joi = require("joi");

const validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    profileImage: Joi.string()
      .uri()
      .allow(null || ""),
    adentification: Joi.string().required(),
    email: Joi.string()
      .email()
      .allow(null || ""),
    phone: Joi.string().allow(null || ""),
    fullname: Joi.string().min(2).max(150).required(),
    password: Joi.string().min(6).max(150).required(),
    birthday: Joi.object()
      .keys({
        day: Joi.object()
          .keys({
            name: Joi.string().required(),
          })
          .required(),
        month: Joi.object()
          .keys({
            name: Joi.string().required(),
          })
          .required(),
        year: Joi.object()
          .keys({
            name: Joi.string().required(),
          })
          .required(),
      })
      .required(),
    username: Joi.string().required(),
    bio: Joi.string().allow(null || ""),
    category: Joi.string(),
    website: Joi.string().uri(),
    gender: Joi.string().allow(null || ""),
    theme: Joi.string(),
    role: Joi.string(),
    notification: Joi.number().allow(null || ""),
    following: Joi.array().items(Joi.object()),
    followers: Joi.array().items(Joi.object()),
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
        // name: Joi.string(),
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

module.exports = { validateUser };
