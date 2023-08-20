const Joi = require("joi");

const validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    adentification: Joi.string().min(2).max(200).required(),
    password: Joi.string().min(3).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
};

module.exports = { validateLogin };
