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

// Prueba de envío de mail y SMS Clase 16
const sendMailTransport = require("../utils/nodemailer");
const sendSMS = require("../utils/sendSMSTwilio");

pruebasRouter.get("/email", async (req, res) => {
	try {
		//Acciones
		await sendMailTransport();
		res.send("El email ha sido enviado.");
	} catch (error) {
		console.log(error);
	}
});

pruebasRouter.get("/sms", async (req, res) => {
	try {
		await sendSMS("Esto es un mensaje SMS de prueba...");
		res.send("El SMS ha sido enviado.");
	} catch (error) {
		console.log(error);
	}
});

const { generateUser } = require("../utils/fakerGenerator.js");

pruebasRouter.get("/user", async (req, res) => {
	try {
		let users = [];
		for (let i = 0; i < 100; i++) {
			users.push(generateUser());
		}
		res.send({ status: "success", payload: users });
	} catch (error) {
		console.log(error);
	}
});

// Prueba de compresión Clase 17

const compression = require("express-compression");

pruebasRouter.get("/stringLargo", (req, res) => {
	let string = "Hola coders, soy un string ridículamente largo";
	for (let i = 0; i < 5e4; i++) {
		string += "Hola coders, soy un string ridículamente largo";
	}
	res.send(string);
});

pruebasRouter.use(compression());

pruebasRouter.get("/compresion", compression(), (req, res) => {
	let string = "Hola coders, soy un string ridículamente largo";
	for (let i = 0; i < 5e4; i++) {
		string += "Hola coders, soy un string ridículamente largo";
	}
	res.send(string);
});

module.exports = pruebasRouter;
