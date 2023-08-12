const { productModel } = require("../models/productsModelMongo.js");

class ProductDaoMongo {
	constructor() {
		this.productModel = productModel;
	}

	get = async (filter, specs) => {
		return await this.productModel.paginate(filter, specs);
	};

	getById = async (pid) => {
		return await this.productModel.find({ _id: pid }).lean();
	};

	create = async (newProduct) => {
		return await this.productModel.create(newProduct);
	};

	update = async (pid, productToUpdate) => {
		return await this.productModel.updateOne({ _id: pid }, productToUpdate);
	};

	delete = async (pid) => {
		return await this.productModel.updateOne({ _id: pid }, { status: false });
	};

	getProductCategories = async () => {
		return await this.productModel.distinct("category");
	};
}

const productMgr = new ProductDaoMongo();

module.exports = { ProductDaoMongo, productMgr };
