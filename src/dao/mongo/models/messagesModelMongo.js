const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "messages";

const MessageSchema = new Schema(
	{
		user: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false }
);

MessageSchema.plugin(mongoosePaginate);

const messageModel = model(collection, MessageSchema);

module.exports = { messageModel };
