const { dirname } = require("node:path");

const swaggerOptions = {
	definition: {
		openapi: "3.0.1",
		info: {
			title: "Documentación de app Proyecto Final Juan Pablo",
			description:
				"Api desarrollada para gestión de un consultorio odontológico",
		},
	},
	apis: [`${dirname(__dirname)}/docs/**/*.yaml`],
};

module.exports = { swaggerOptions };
