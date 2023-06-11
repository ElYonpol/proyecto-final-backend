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
					unique: true,
				},
				quantity: {
					type: Number,
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
