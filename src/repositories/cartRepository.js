const RepositoryGeneric = require("./repositoryGeneric.js");

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
	async getProductsByCartId(cid) {
		return await this.dao.getProductsByCartId(cid);
	}
	async updateCartById(cid, products) {
		return await this.dao.updateCartById(cid, products);
	}
}

module.exports = CartRepository;
