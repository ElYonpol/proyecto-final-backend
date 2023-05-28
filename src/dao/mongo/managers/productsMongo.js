const { productModel } = require("./models/productsModelMongo.js");

class ProductDaoMongo {
	async get(filter, specs) {
		return await productModel.paginate(filter, specs);
	}
}

module.exports = ProductDaoMongo;
