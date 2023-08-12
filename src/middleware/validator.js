const Joi = require("joi");
const UserDto = require("../dto/userDto");

const usersValidation = (schema) => (req, res, next) => {
	const userRaw = req.body;
	const user = new UserDto(userRaw);
	const result = schema.validate(user);

	if (result.error)
		return res.status(400).json({ status: "error usersValidation", payload: result.error });
	next();
};

const objectsValidation = (schema) => (req, res, next) => {
	const objectsData = req.body;
	const result = schema.validate(objectsData);

	if (result.error)
		return res.status(400).json({ status: "error objectsValidation", payload: result.error });
	next();
};

module.exports = { usersValidation, objectsValidation };
