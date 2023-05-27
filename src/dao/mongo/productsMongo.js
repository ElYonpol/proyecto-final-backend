const { productModel } = require("./models/productsModelMongo");

class ProductDaoMongo {
	async get(filter, specs) {
		return await productModel.paginate(filter, specs);
	}
}

module.exports = ProductDaoMongo;
