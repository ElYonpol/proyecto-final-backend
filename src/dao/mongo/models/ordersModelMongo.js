const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "orders";

const OrderSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "products",
				},
			},
		],
		total: Number,
		created: Date,
	},
	{ versionKey: false }
);

OrderSchema.plugin(mongoosePaginate);
const orderModel = model(collection, OrderSchema);

module.exports = { orderModel };
