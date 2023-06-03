const { Router } = require("express");
const { fork } = require("child_process");

const pruebasRouter = Router();

const operacionCompleja = (params) => {
	let result = 0;
	for (let i = 0; i < 5e9; i++) {
		result += 1;
	}
	return result;
};
pruebasRouter.get("/complejaBlock", (req, res) => {
	const result = operacionCompleja();
	res.send(`<center><h1>El resultado es ${result}</h1></center>`);
});

pruebasRouter.get("/complejaNoBlock", (req, res) => {
	const child = fork("./src/utils/operacionCompleja.js");
	child.send("Inicia el cálculo por favor");
	child.on("message", (result) => {
		res.send(`<center><h1>El resultado es ${result}</h1></center>`);
	});
});

// Prueba de envío de mail Clase 16
const sendMailTransport = require("../utils/nodemailer");

pruebasRouter.get("/email", async (req, res) => {
	try {
		//Acciones
		await sendMailTransport()
		res.send("El email ha sido enviado.")
	} catch (error) {
		console.log(error);
	}
})

module.exports = pruebasRouter;
