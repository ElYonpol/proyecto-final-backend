const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ordersCollection = "orders";

const OrderSchema = new Schema({
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
});

OrderSchema.plugin(mongoosePaginate)
const orderModel = model(ordersCollection, OrderSchema);

module.exports = { orderModel };
