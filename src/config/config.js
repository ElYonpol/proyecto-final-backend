const { commander } = require("../utils/commander.js");
const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

const objConfig = {
	port: process.env.PORT,
	mongoURL: process.env.MONGO_URL,
	adminName: process.env.ADMIN_NAME,
	adminPassword: process.env.ADMIN_PASSWORD,
	jwtSecretKey: process.env.JWT_SECRET_KEY,
	sessionSecretKey: process.env.SESSION_SECRET_KEY,
	cookieName: process.env.COOKIE_NAME,
	persistence: process.env.PERSISTENCE,
	github_client_ID: process.env.GITHUB_CLIENT_ID,
	github_client_secret: process.env.GITHUB_CLIENT_SECRET,
	gmail_mail_user: process.env.GMAIL_MAIL_USER,
	gmail_app_password: process.env.GOOGLE_APPLICATION_PASSWORD,
	twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
	twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
	twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
	twilio_my_phone_number: process.env.TWILIO_MY_PHONE_NUMBER,
};

module.exports = { objConfig };
