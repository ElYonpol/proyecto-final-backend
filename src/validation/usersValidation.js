const Joi = require("joi");

const usersCreationSchema = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	full_name: Joi.string(),
	email: Joi.string().required(),
	username: Joi.string().required(),
	role: Joi.string().required(),
	password: Joi.string().required(),
	status: Joi.boolean(),
});

const usersUpdatingSchema = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	full_name: Joi.string(),
	email: Joi.string().required(),
	username: Joi.string().required(),
	role: Joi.string().required(),
	password: Joi.string().required(),
	status: Joi.boolean(),
});

module.exports = { usersCreationSchema, usersUpdatingSchema };
