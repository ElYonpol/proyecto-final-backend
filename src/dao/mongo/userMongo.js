const { userModel } = require("./models/usersModelMongo.js");

class UserDaoMongo {
	get = async (filter, specs) => {
		return await userModel.paginate(filter, specs);
	};

	getById = async (uid) => {
		return await userModel.find({ _id: uid });
	};

	getByEmail = async (userEmail) => {
		return await userModel.find({ email: userEmail });
	};

	getByUsername = async (userUsername) => {
		return await userModel.find({ username: userUsername });
	};

	create = async (newUser) => {
		return await userModel.create(newUser);
	};

	update = async (uid, userToUpdate) => {
		return await userModel.updateOne({ _id: uid }, userToUpdate);
	};

	delete = async (uid) => {
		return await userModel.updateOne({ _id: uid }, { status: false });
	};

	getUserRoles = async () => {
		return await userModel.distinct("role");
	};
}

const userMgr = new UserDaoMongo();

module.exports = UserDaoMongo;
