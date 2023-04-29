const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

cartSchema.plugin(mongoosePaginate);
cartSchema.pre("find", function () {
	this.populate("products.product");
});

const cartModel = model(collection, cartSchema);

module.exports = { cartModel };
