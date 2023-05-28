const Joi = require("joi");
const UserDto = require("../dto/userDto");

const usersValidation = (schema) => (req, res, next) => {
	const objectRaw = req.body;
	const object = new UserDto(objectRaw)
	const result = schema.validate(object);

	if (result.error)
		return res.status(400).json({ status: "error", payload: result.error });
	next();
};

const productsValidation = (schema) => (req, res, next) => {
	const object = req.body;
	const result = schema.validate(object);

	if (result.error)
		return res.status(400).json({ status: "error", payload: result.error });
	next();
};

module.exports = { usersValidation, productsValidation };
