const Joi = require("joi");
const UserDto = require("../dto/userDto");

const objectsValidation = (schema) => (req, res, next) => {
	const objectRaw = req.body;
	const object = new UserDto(objectRaw)
	const result = schema.validate(object);

	if (result.error)
		return res.status(400).json({ status: "error", payload: result.error });
	next();
};

module.exports = { objectsValidation };
