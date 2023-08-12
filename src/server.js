const { initServer } = require("./app.js");
const cluster = require("cluster");
const { cpus } = require("os");
const { logger } = require("./utils/logger.js");

// logger.info(process.pid);
// logger.info(cluster.isPrimary);
// const numeroProcesadores = cpus().length;
// logger.info(numeroProcesadores);

// if (cluster.isPrimary) {
// 	logger.info("Proceso primario, generando un proceso trabajador");
// 	for (let i = 0; i < numeroProcesadores; i++) {
// 		cluster.fork();
// 	}
// 	cluster.on("message", (worker) => {
// 		logger.info(`El worker ${worker.process.pid} dice ${worker.message}`);
// 	});
// } else {
// 	logger.info(
// 		"Al ser un proceso forkeado, no cuento como primario, por lo tanto isPrimary = false, entonces soy un worker"
// 	);
// 	logger.info(`Me presento soy un proceso worker con el id: ${process.pid}`);
// 	initServer();
// }

initServer();
