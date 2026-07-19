const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(20).required(),

  fullName: Joi.string().trim().max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(8).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

