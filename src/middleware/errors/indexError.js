const EErrors = require("../../utils/errors/EErrors");

const indexError = (error, req, res, next) => {
	console.error(error.cause);
	switch (error.code) {
		case EErrors.INVALID_TYPE_ERROR:
			res.send({ status: "middleware error", error: error.name });
			break;

		default:
			res.send({ status: "middleware error", error: "Error no manejado" });
			break;
	}
};

module.exports = indexError;
