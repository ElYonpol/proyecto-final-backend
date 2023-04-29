const { Schema, model } = require("mongoose");

const messagesCollection = "messages";

const messageSchema = new Schema({
	user: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

const messageModel = model(messagesCollection, messageSchema);

module.exports = { messageModel };
