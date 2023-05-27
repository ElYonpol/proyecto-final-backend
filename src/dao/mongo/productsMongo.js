const { productModel } = require("../../models/dbMongo/productsModelMongo");

class ProductDaoMongo {
	async get(filter, specs) {
		return await productModel.paginate(filter, specs);
	}
}

module.exports = ProductDaoMongo;
