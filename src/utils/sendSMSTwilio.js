const twilio = require("twilio");
const { objConfig } = require("../config/config.js");
const {
	twilio_account_sid,
	twilio_auth_token,
	twilio_phone_number,
	twilio_my_phone_number,
} = objConfig;

const client = twilio(twilio_account_sid, twilio_auth_token);

sendSMS = async () => {
	await client.messages.create({
		body: "Esto es un mensaje SMS de prueba...",
		from: twilio_phone_number,
		to: twilio_my_phone_number,
	});
};

module.exports = sendSMS;
