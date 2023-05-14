const { Schema, model } = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate-v2");

const messagesCollection = "messages";

const messageSchema = new Schema({
	user: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

// messageSchema.plugin(mongoosePaginate);
const messageModel = model(messagesCollection, messageSchema);

module.exports = { messageModel };
