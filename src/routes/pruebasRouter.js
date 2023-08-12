const { Router } = require("express");
const { fork } = require("child_process");
const { logger } = require("../utils/logger");

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

// Prueba de envío de mail y SMS Clase 16 ----------------------------------------------------------------
const sendMailTransport = require("../utils/nodemailer");
const sendSMS = require("../utils/sendSMSTwilio");

pruebasRouter.get("/email", async (req, res) => {
	try {
		//Acciones
		const configMail = {
			to: "jppe@yahoo.com.ar",
			subject: "Portas Esquivel & Asociados - Odontología de Excelencia",
			html: `
				<div>
					<h1>Mensaje de prueba</h1>
					<p>Este es un mensaje de prueba enviado automáticamente...</p>
				</div>
				`,
			attachments: [
				{
					filename: "icon_pe.jpg",
					path:
						dirname(dirname(__dirname)) + "/public/assets/icons/icon_pe.jpg",
					cid: "icon_pe.jpg",
				},
			],
		};
		await sendMailTransport(configMail);
		res.send("El email ha sido enviado.");
	} catch (error) {
		logger.error(error);
	}
});

pruebasRouter.get("/sms", async (req, res) => {
	try {
		await sendSMS("Esto es un mensaje SMS de prueba...");
		res.send("El SMS ha sido enviado.");
	} catch (error) {
		logger.error(error);
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
		logger.error(error);
	}
});

// Prueba de compresión Clase 17 ----------------------------------------------------------------
const compression = require("express-compression");

pruebasRouter.get("/stringLargo", (req, res) => {
	let string = "Hola coders, soy un string ridículamente largo";
	for (let i = 0; i < 5e4; i++) {
		string += "Hola coders, soy un string ridículamente largo";
	}
	res.send(string);
});

pruebasRouter.use(
	compression({
		brotli: {
			enabled: true,
			zlib: {},
		},
	})
);

pruebasRouter.get("/compresion", (req, res) => {
	let string = "Hola coders, soy un string ridículamente largo";
	for (let i = 0; i < 5e4; i++) {
		string += "Hola coders, soy un string ridículamente largo";
	}
	res.send(string);
});

// Prueba de Artillery: Operación Sencilla y Compleja Clase 18 ----------------------------------------------------------------
pruebasRouter.get("/sencilla", (req, res) => {
	let suma = 0;
	for (let i = 0; i < 1e6; i++) {
		suma += i;
	}
	res.send({ suma });
});
pruebasRouter.get("/compleja", (req, res) => {
	let suma = 0;
	for (let i = 0; i < 5e8; i++) {
		suma += i;
	}
	res.send({ suma });
});

// artillery quick --count 40 --num 50 "http://localhost:8080/api/pruebas/sencilla" -o simple.json
// artillery quick --count 40 --num 50 "http://localhost:8080/api/pruebas/compleja" -o compleja.json

const { faker } = require("@faker-js/faker");

pruebasRouter.get("/test/user", (req, res) => {
	let first_name = faker.name.firstName();
	let last_name = faker.name.lastName();
	let email = faker.internet.email();
	let username = faker.internet.userName();
	let password = faker.internet.password();
	let confirm_password = password;
	res.send({
		first_name,
		last_name,
		email,
		username,
		password,
		confirm_password,
	});
});

// - artillery run config.yml --output testPerformance.json
// - artillery report testPerformance.json -o testResult.html

// artillery quick --count 40 --num 50 "http://localhost:8080/api/pruebas/sencilla" -o simpleF.json
// artillery quick --count 40 --num 50 "http://localhost:8080/api/pruebas/compleja" -o complejaF.json

module.exports = pruebasRouter;
