const EErrors = require("../../utils/errors/EErrors.js");

const indexError = (error, req, res, next) => {
	req.logger.error(error);
	switch (error.code) {
		case EErrors.CART_PURCHASING_ERROR:
			res.status(404).json({ status: "middleware error", error: error.name });
			break;
		case EErrors.CART_EMPTY_ERROR:
			res.status(404).json({ status: "middleware error", error: error.name });
			break;
		case EErrors.INVALID_TYPE_ERROR:
			res.send({ status: "middleware error", error: error.name });
			break;

		default:
			res.send({ status: "middleware error", error: "Error no manejado" });
			break;
	}
};

module.exports = indexError;
