const { Schema, model } = require("mongoose");

const cartsCollection = "carts";

const cartSchema = new Schema({
	products: [
		{
			pid: {
				type: Schema.Types.ObjectId,
				ref: "products",
				unique: true,
			},
			quantity: {
				type: Number,
				default: 1,
			},
		},
	],
});

cartSchema.pre("find", function () {
	this.populate("products.pid");
});

const cartModel = model(cartsCollection, cartSchema);

module.exports = { cartModel };
