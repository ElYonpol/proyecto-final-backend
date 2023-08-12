const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "tokens";

const TokenSchema = new Schema(
	{
		token: {
			type: String,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
		expireDate: Date,
	},
	{ versionKey: false }
);

TokenSchema.plugin(mongoosePaginate);
const tokenModel = model(collection, TokenSchema);

module.exports = { tokenModel };
