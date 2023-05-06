const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "users";

const UserSchema = new Schema({
	first_name: {
		type: String,
		index: true,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	username: {
		type: String,
		unique: true,
		required: true,
	},
	role: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	status: {
		type: Boolean,
		default: true,
		required: false,
	},
});

UserSchema.plugin(mongoosePaginate);
const userModel = model(collection, UserSchema);

module.exports = {
	userModel,
};
