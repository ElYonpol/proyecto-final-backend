const { connect } = require("mongoose");
const { commander } = require("../utils/commander.js");
const { logger } = require("./logger.js");
const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

let URL = process.env.DB_HOST;

class MongoSingleton {
	static #instance;
	constructor() {
		connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
	}

	static getInstance() {
		if (this.#instance) {
			logger.info("Base de datos Mongo ya estaba conectada (MongoSingleton.js)");
			return this.#instance;
		}
		this.#instance = new MongoSingleton();
		logger.info("Base de datos Mongo conectada (MongoSingleton.js)");

		return this.#instance;
	}
}

module.exports = MongoSingleton;
