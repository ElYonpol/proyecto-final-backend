const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const cartsCollection = "carts";

const CartSchema = new Schema({
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

CartSchema.pre("find", function () {
	this.populate("products.pid");
});

CartSchema.plugin(mongoosePaginate)

const cartModel = model(cartsCollection, CartSchema);

module.exports = { cartModel };
