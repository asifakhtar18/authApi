const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required()
});

module.exports = userSchema