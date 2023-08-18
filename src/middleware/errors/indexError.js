const EErrors = require("../../utils/errors/EErrors.js");

const indexError = (error, req, res, next) => {
	req.logger.error(error.stack);
	switch (error.code) {
		case EErrors.CART_PURCHASING_ERROR:
			res.status(404).json({ status: "middleware error CART_PURCHASING", error: error.name });
			break;
		case EErrors.CART_EMPTY_ERROR:
			res.status(404).json({ status: "middleware error CART_EMPTY", error: error.name });
			break;
		case EErrors.INVALID_TYPE_ERROR:
			res.send({ status: "middleware error INVALID_TYPE", error: error.name });
			break;

		default:
			res.send({ status: "middleware error DEFAULT", error: "Error no manejado" });
			break;
	}
};

module.exports = indexError;
