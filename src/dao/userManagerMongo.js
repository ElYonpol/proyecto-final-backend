const { userModel } = require("./models/dbMongo/usersModelMongo.js");

class UserManagerMongo {
	getUsers = async (filter, specs) => {
		return await userModel.paginate(filter, specs);
	};
	
	getUserByID = async (uid) => {
		return await userModel.find({ _id: uid });
	};

	getUserByEmail = async (userEmail) => {
		return await userModel.find({ email: userEmail });
	};

	getUserByUsername = async (userUsername) => {
		return await userModel.find({ username: userUsername });
	};

	addUser = async (newUser) => {
		return await userModel.create(newUser);
	};

	updateUser = async (uid, userToUpdate) => {
		return await userModel.updateOne({ _id: uid }, userToUpdate);
	};

	deleteUser = async (uid) => {
		return await userModel.updateOne({ _id: uid }, { status: false });
	};

	getUserRoles = async () => {
		return await userModel.distinct("role");
	};
}

const userMgr = new UserManagerMongo();

module.exports = { UserManagerMongo, userMgr };
