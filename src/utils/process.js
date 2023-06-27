const { logger } = require("./logger");

exports.processFunction = () => {
	// logger.info("cwd:",process.cwd())
	// logger.info("pid:",process.pid)
	// logger.info("memory:",process.memoryUsage())
	// logger.info("env:",process.env)

	// logger.info("argv:",process.argv)
	// logger.info("version:",process.version)

	logger.info("argv:", process.argv);
	logger.info("argv sin las dos primeras", process.argv.slice(2));
};

process.on("exit", (code) => {
	logger.info(
		"Este código se ejecutará justo antes de salir del proceso.",
		code
	);
});
process.on("uncaughtException", (exception) => {
	logger.info(
		"Este código atrapa todas las excepciones no controladas como una llamada a una función no declarada.",
		exception
	);
});

logger.info("Excepción");
logger.info(excepcion())
