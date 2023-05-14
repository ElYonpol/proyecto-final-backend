const { messageModel } = require("./models/dbMongo/messagesModelMongo.js");

class MessageManagerMongo {
	getMessages = async () => {
		return await messageModel.find().lean();
	};

	getMessageById = async (mid) => {
		return await messageModel.find({ _id: mid }).lean();
	};

	addMessage = async (message) => {
		try {
			return await messageModel.create(message);
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	updateMessage = async (mid, changes) => {
		return await messageModel.updateOne({ _id: mid }, changes);
	};

	deleteMessage = async (mid) => {
		return await messageModel.deleteOne({ _id: mid });
	};
}

const messageMgr = new MessageManagerMongo();

module.exports = { MessageManagerMongo, messageMgr };
