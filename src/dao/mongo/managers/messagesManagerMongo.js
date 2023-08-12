const { messageModel } = require("../models/messagesModelMongo.js");

class MessageDaoMongo {
    constructor(){
        this.messageModel = messageModel
    }

	get = async () => {
		return await messageModel.find().lean();
	};

	getById = async (mid) => {
		return await messageModel.find({ _id: mid }).lean();
	};

	create = async (message) => {
		try {
			return await messageModel.create(message);
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	update = async (mid, changes) => {
		return await messageModel.updateOne({ _id: mid }, changes);
	};

	delete = async (mid) => {
		return await messageModel.deleteOne({ _id: mid });
	};
}

const messageMgr = new MessageDaoMongo();

module.exports = { MessageDaoMongo, messageMgr };
