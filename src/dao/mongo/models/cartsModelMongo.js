const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "carts";

const CartSchema = new Schema(
	{
		products: [
			{
				pid: {
					type: Schema.Types.ObjectId,
					ref: "products",
					required: true,
					// unique: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
				},
			},
		],
	},
	{ versionKey: false }
);

CartSchema.pre("find", function () {
	this.populate("products.pid");
});

CartSchema.plugin(mongoosePaginate);

const cartModel = model(collection, CartSchema);

module.exports = { cartModel };
