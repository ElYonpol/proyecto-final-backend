const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "emails";

const EmailSchema = new Schema(
	{
		email_from: {
			type: String,
			required: true,
		},
		email_to: {
			type: String,
			required: true,
			index: true,
		},
		subject: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		attachments: {
			type: Array,
			required: false,
		},
		status: {
			type: Boolean,
			default: true,
			required: false,
		},
	},
	{ versionKey: false }
);

EmailSchema.plugin(mongoosePaginate);

const emailModel = model(collection, EmailSchema);

module.exports = { emailModel };
