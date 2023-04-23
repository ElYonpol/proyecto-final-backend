const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "products";

const productSchema = new Schema({
	code: {
		type: String,
		unique: true,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	thumbnails: {
		type: Array,
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
		required: false,
	},
	stock: {
		type: Number,
		required: true,
	},
});

productSchema.plugin(mongoosePaginate);
const productModel = model(collection, productSchema);

module.exports = { productModel };
