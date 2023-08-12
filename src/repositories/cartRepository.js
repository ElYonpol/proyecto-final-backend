const RepositoryGeneric = require("./repositoryGeneric");

class CartRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico (ejemplo el DTO)
	async addProductToCartbyId(cid, products) {
		return await this.dao.addProductToCartbyId(cid, products);
	}
	async deleteProductFromCart(cid, pid) {
		return await this.dao.deleteProductFromCart(cid, pid);
	}
	async updateProductsByCartId(cid, newProducts) {
		return await this.dao.updateProductFromCart(cid, newProducts);
	}
	async updateProductFromCart(cid, pid, quantity) {
		return await this.dao.updateProductFromCart(cid, pid, quantity);
	}
}

module.exports = CartRepository;
