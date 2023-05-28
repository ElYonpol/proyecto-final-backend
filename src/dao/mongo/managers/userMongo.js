const { userModel } = require("../models/usersModelMongo.js");

class UserDaoMongo {
	constructor(){
		this.userModel = userModel
	}

	get = async (filter, specs) => {
		return await this.userModel.paginate(filter, specs);
	};

	getById = async (uid) => {
		return await this.userModel.find({ _id: uid });
	};

	getByEmail = async (userEmail) => {
		return await this.userModel.find({ email: userEmail });
	};

	getByUsername = async (userUsername) => {
		return await this.userModel.find({ username: userUsername });
	};

	create = async (newUser) => {
		return await this.userModel.create(newUser);
	};

	update = async (uid, userToUpdate) => {
		return await this.userModel.updateOne({ _id: uid }, userToUpdate);
	};

	delete = async (uid) => {
		return await this.userModel.updateOne({ _id: uid }, { status: false });
	};

	getUserRoles = async () => {
		return await this.userModel.distinct("role");
	};
}

const userMgr = new UserDaoMongo();

module.exports = UserDaoMongo;
