const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "products";

const ProductSchema = new Schema(
	{
		code: {
			type: String,
			unique: true,
			required: true,
			index: true,
		},
		category: {
			type: String,
			required: true,
		},
		thumbnails: {
			// type: Array,
			type: [String],
			default: ["https://picsum.photos/300/200"],
			required: false,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		status: {
			type: Boolean,
			default: true,
			required: false,
		},
		stock: {
			type: Number,
			required: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "users",
			unique: true,
			required: false,
		},
	},
	{ versionKey: false }
);

ProductSchema.plugin(mongoosePaginate);

const productModel = model(collection, ProductSchema);

module.exports = { productModel };
