const RepositoryGeneric = require("./repositoryGeneric.js");

class ProductRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico
	async getProductCategories() {
		return await this.dao.getProductCategories()
	};
}

module.exports = ProductRepository;
