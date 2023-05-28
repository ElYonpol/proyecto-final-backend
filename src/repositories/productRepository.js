const RepositoryGeneric = require("./repositoryGeneric");

class ProductRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico
	async getProductCategories() {
		return await this.getProductCategories();
	};
}

module.exports = ProductRepository;
