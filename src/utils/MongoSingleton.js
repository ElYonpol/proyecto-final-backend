const { connect } = require("mongoose");
const { commander } = require("../utils/commander.js");
const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

//Nota para Tutor: Link de la URL está en el mensaje de la entrega
// let URL ="//colocar aquí la URL del mensaje de la entrega";
let URL = process.env.DB_HOST;

class MongoSingleton {
	static #instance;
	constructor() {
		connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
	}

	static getInstance() {
		if (this.#instance) {
			console.log("Base de datos Mongo ya estaba conectada (MongoSingleton.js)");
			return this.#instance;
		}
		this.#instance = new MongoSingleton();
		console.log("Base de datos Mongo conectada (MongoSingleton.js)");

		return this.#instance;
	}
}

module.exports = MongoSingleton;
