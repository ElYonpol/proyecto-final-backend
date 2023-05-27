const { Schema, model } = require("mongoose");

const ordersCollection = "orders";

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: "products",
		},
	],
	total: Number,
	created: Date,
});

const orderModel = model(ordersCollection, orderSchema);

module.exports = { orderModel };
