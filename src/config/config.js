const { connect } = require("mongoose");
const { commander } = require("../utils/commander.js");

const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

//Nota para Tutor: Link de la URL está en el mensaje de la entrega
// let URL ="//colocar aquí la URL del mensaje de la entrega";
let URL = process.env.DB_HOST;

const objConfig = {
	connectDB: async () => {
		try {
			await connect(URL);
			console.log("Base de datos Mongo conectada");
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = { objConfig };
