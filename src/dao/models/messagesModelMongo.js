const { Schema, model } = require("mongoose");

const collection = "messages";

const messageSchema = new Schema({
	user: {
		type: String,
		unique: true,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

const messageModel = model(collection, messageSchema);

module.exports = { messageModel };
