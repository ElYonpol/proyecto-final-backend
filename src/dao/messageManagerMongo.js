const { messageModel } = require("./models/dbMongo/messagesModelMongo.js");

class MessageManagerMongo {
	getMessages = async () => {
		return await messageModel.find();
	};

	addMessage = async (message) => {
		return await messageModel.create(message);
	};

	updateMessage = async (mid, changes) => {
		return await messageModel.updateOne({ _id: mid }, changes);
	};

	deleteMessage = async (mid) => {
		return await messageModel.deleteOne({ _id: mid });
	};

	getMessageById = async (mid) => {
		return await messageModel.find({ _id: mid });
	};
}

const messageMgr = new MessageManagerMongo();

module.exports = { MessageManagerMongo, messageMgr };
