const Joi = require("joi");

const validateEditUser = (_reqBody) => {
  const joiSchema = Joi.object({
    bio: Joi.string().allow(null || ""),
    category: Joi.string().allow(null || ""),
    website: Joi.string()
      .uri()
      .allow(null || ""),
    gender: Joi.string().allow(null || ""),
  });

  return joiSchema.validate(_reqBody);
};

module.exports = { validateEditUser };
