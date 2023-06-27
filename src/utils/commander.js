const { Command } = require("commander");
const { logger } = require("./logger");

const commander = new Command();

commander
	// .option("-d","Variable de debugs", false)
	// .option("-p, --port <port>", "Puerto del servidor", 8080)
	.option("--mode <mode>", "Modo de ejecución de la app", "development")
	// .requiredOption("-u <user>","Usuario utilizando app","No se ha declarado el user")
	// .option("-l, --letters [letters...]","Specify the letters")
	.parse();

// logger.info("Options: ",commander.opts())
// logger.info("Remaining Arguments: ", commander.args)

// node commander -d -p 3000 --mode development -u root --letters a b c
// node commander -p 3000 --mode development -u root --letters a b c
// node commander -p 3000 -u root --letters a b c
// node commander -p 3000 --letters a b c
// node commander -p 3000 -u root A A A --letters a b c  // Acá va a poner Remaining Arguments A A A

module.exports = { commander };
