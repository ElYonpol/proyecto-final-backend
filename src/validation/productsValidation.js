const Joi = require("joi");

const productsCreationSchema = Joi.object({
	code: Joi.string().required(),
	category: Joi.string().required(),
	thumbnails: Joi.array(),
	title: Joi.string().required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	status: Joi.boolean(),
	stock: Joi.number().required(),
});

const productsUpdatingSchema = Joi.object({
	code: Joi.string().required(),
	category: Joi.string().required(),
	thumbnails: Joi.array(),
	title: Joi.string().required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	status: Joi.boolean(),
	stock: Joi.number().required(),
});

module.exports = { productsCreationSchema, productsUpdatingSchema };
