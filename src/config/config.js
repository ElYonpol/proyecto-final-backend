const { connect } = require("mongoose");
const { commander } = require("../utils/commander.js");
const MongoSingleton = require("../utils/MongoSingleton.js");
const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

// //Nota para Tutor: Link de la URL está en el mensaje de la entrega
// // let URL ="//colocar aquí la URL del mensaje de la entrega";
// let URL = process.env.DB_HOST;

const objConfig = {
	persistence: process.env.PERSISTENCE,
	gmail_mail_user: process.env.GMAIL_MAIL_USER,
	gmail_pass: process.env.GOOGLE_APPLICATION_PASSWORD,
	twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
	twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
	twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
	twilio_my_phone_number: process.env.TWILIO_MY_PHONE_NUMBER,
	dbConnection: async () => MongoSingleton.getInstance(),
	
	// connectDB: async () => {
	// 	try {
	// 		await connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
	// 		console.log("Base de datos Mongo conectada (config.js)");
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// },
};

module.exports = { objConfig };
