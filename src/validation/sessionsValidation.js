const Joi = require("joi");

const usersLoginSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

const usersRegisterSchema = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ar"] } })
		.required(),
	password: Joi.string().required(),
	confirm_password: Joi.string().required(),
});

module.exports = { usersLoginSchema, usersRegisterSchema };
