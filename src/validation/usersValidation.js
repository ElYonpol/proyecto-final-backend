const Joi = require("joi");

const usersCreationSchema = Joi.object({
	first_name: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).required(),
	last_name: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).required(),
	full_name: Joi.string(),
	email: Joi.string().required(),
	username: Joi.string().required(),
	role: Joi.string().required(),
	password: Joi.string().min(4).required(),
	status: Joi.boolean(),
});

const usersUpdatingSchema = Joi.object({
	first_name: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).required(),
	last_name: Joi.string().pattern(/^[a-zA-Z]+$/).min(3).required(),
	full_name: Joi.string(),
	email: Joi.string().required(),
	username: Joi.string().required(),
	role: Joi.string().required(),
	password: Joi.string().min(4).required(),
	status: Joi.boolean(),
});

module.exports = { usersCreationSchema, usersUpdatingSchema };
