exports.processFunction = () => {
	// console.log("cwd:",process.cwd())
	// console.log("pid:",process.pid)
	// console.log("memory:",process.memoryUsage())
	// console.log("env:",process.env)

	// console.log("argv:",process.argv)
	// console.log("version:",process.version)

	console.log("argv:", process.argv);
	console.log("argv sin las dos primeras", process.argv.slice(2));
};

process.on("exit", (code) => {
	console.log(
		"Este código se ejecutará justo antes de salir del proceso.",
		code
	);
});
process.on("uncaughtException", (exception) => {
	console.log(
		"Este código atrapa todas las excepciones no controladas como una llamada a una función no declarada.",
		exception
	);
});

console.log("Excepción");
console.log(excepcion())
