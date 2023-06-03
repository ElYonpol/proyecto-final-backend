const { connect } = require("mongoose");
const { commander } = require("../utils/commander.js");
const MongoSingleton = require("../utils/MongoSingleton.js");
const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

const objConfig = {
	persistence: process.env.PERSISTENCE,
	gmail_mail_user: process.env.GMAIL_MAIL_USER,
	gmail_pass: process.env.GOOGLE_APPLICATION_PASSWORD,
	twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
	twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
	twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
	twilio_my_phone_number: process.env.TWILIO_MY_PHONE_NUMBER,
	dbConnection: async () => MongoSingleton.getInstance(),
};

module.exports = { objConfig };
