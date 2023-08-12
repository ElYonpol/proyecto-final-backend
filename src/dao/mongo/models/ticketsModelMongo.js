const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "tickets";

const TicketSchema = new Schema(
	{
		ticketCode: {
			type: String,
			index: true,
			unique: true,
			required: true,
		},
		purchaseDateTime: {
			type: Date,
			default: Date.now(),
			required: true,
		},
		totalTicketAmount: {
			type: Number,
			required: true,
		},
		purchaser: {
			type: Schema.Types.ObjectId,
			ref: "users",
			unique: true,
		},
		status: {
			type: Boolean,
			default: true,
			required: false,
		},
	},
	{ versionKey: false }
);

TicketSchema.plugin(mongoosePaginate);

const ticketModel = model(collection, TicketSchema);

module.exports = { ticketModel };
