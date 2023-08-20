const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "tickets";

const TicketSchema = new Schema(
	{
		ticketCode: {
			type: String,
			index: true,
		},
		purchaseDateTime: {
			type: Date,
		},
		totalTicketAmount: {
			type: Number,
		},
		purchaser: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: "products",
			},
		],
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
