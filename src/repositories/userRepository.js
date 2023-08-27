const UserDto = require("../dto/userDto.js");
const RepositoryGeneric = require("./repositoryGeneric.js");

class UserRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico (ejemplo el DTO)
	async getUserRoles() {
		return await this.dao.getUserRoles();
	}
	async getByEmail(userEmail) {
		return await this.dao.getByEmail(userEmail);
	}
	async getByUsername(userUsername) {
		return await this.dao.getByUsername(userUsername);
	}
}

module.exports = UserRepository;
