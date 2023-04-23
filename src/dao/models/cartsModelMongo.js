const { Schema, model } = require("mongoose");

const collection = "carts";

const cartSchema = new Schema({
	products: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: "products",
			},
			// quantity : {}
		},
	],
	// product: {
	// 	type: Array,
	// 	unique: true,
	// 	required: true,
	// },
});

cartSchema.pre("find", function () {
	this.populate("products.product");
});

const cartModel = model(collection, cartSchema);

module.exports = { cartModel };
