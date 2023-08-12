const { tokenModel } = require("../models/tokensModelMongo.js");

class TokenDaoMongo {
	constructor() {
		this.tokenModel = tokenModel;
	}

	get = async (filter, specs) => {
		return await this.tokenModel.paginate(filter, specs);
	};

	getByTokenId = async (tid) => {
		return await this.tokenModel.findOne({ _id: tid });
	};

	getByUserId = async (uid) => {
		return await this.tokenModel.find({ user: uid });
	};

	create = async (token) => {
		return await this.tokenModel.create(token);
	};

	delete = async (tid) => {
		return await this.tokenModel.deleteOne({_id: tid})
	};
}

const tokenMgr = new TokenDaoMongo();

module.exports = { TokenDaoMongo, tokenMgr };
