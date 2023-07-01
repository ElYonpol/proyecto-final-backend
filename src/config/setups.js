const dotenv = require("dotenv");
dotenv.config();

const SERVER_URL = process.env.SERVER_URL // || "http://localhost";
const PORT = process.env.PORT //|| 8080;
const MONGO_URL = process.env.MONGO_URL // || "mongodb://localhost:27017/ecommerce";
const DB_AUTO_INDEX = Boolean(process.env.DB_AUTO_INDEX) || false;
const DB_BUFFER_COMMANDS = Boolean(process.env.DB_BUFFER_COMMANDS) || false;
const DB_OPTIONS = {
	autoIndex: DB_AUTO_INDEX,
	bufferCommands: DB_BUFFER_COMMANDS,
};

module.exports = {
	SERVER_URL,
	PORT,
	MONGO_URL,
	DB_AUTO_INDEX,
	DB_BUFFER_COMMANDS,
	DB_OPTIONS,
};
