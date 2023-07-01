const { Router } = require("express");
const { logger } = require("../utils/logger");

const loggerRouter = Router();

loggerRouter.get("/", async (req, res) => {
	try {
		logger.fatal("Mensaje error nivel 0: fatal")
		logger.error("Mensaje error nivel 1: error")
		logger.warning("Mensaje error nivel 2: warning")
		logger.info("Mensaje error nivel 3: info")
		logger.http("Mensaje error nivel 4: http")
		logger.debug("Mensaje error nivel 5: debug")
		res.send({ status: "success"});
	} catch (error) {
		res.status(400).json({
			status: "error loggerRouter",
			payload: {
				error: error,
				message: error.message,
			},
		});
	}
});

module.exports = loggerRouter;