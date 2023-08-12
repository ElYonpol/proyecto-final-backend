const twilio = require("twilio");
const { objConfig } = require("../config/config.js");

const {
	twilio_account_sid,
	twilio_auth_token,
	twilio_phone_number,
	twilio_my_phone_number,
} = objConfig;

const client = twilio(twilio_account_sid, twilio_auth_token);

const sendSMS = async (body) => {
	await client.messages.create({
		body: body,
		from: twilio_phone_number,
		to: twilio_my_phone_number,
	});
};

module.exports = sendSMS;
