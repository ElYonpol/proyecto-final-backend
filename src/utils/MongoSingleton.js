const { connect } = require("mongoose");
const { commander } = require("../utils/commander.js");
const { logger } = require("./logger.js");
const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

let MONGO_URL = process.env.MONGO_URL;

class MongoSingleton {
	static #instance;
	constructor() {
		connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
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
