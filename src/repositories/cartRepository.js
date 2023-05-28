const RepositoryGeneric = require("./repositoryGeneric");

class CartRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico (ejemplo el DTO)
	async getUserRoles() {
		return await this.dao.getUserRoles();
	}
	async getByEmail() {
		return await this.dao.getByEmail(userEmail);
	}
	async getByUsername() {
		return await this.dao.getByUsername(userUsername);
	}
}

module.exports = CartRepository;
