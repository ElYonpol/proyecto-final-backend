const { productModel } = require("../models/dbMongo/productsModelMongo.js");

class ProductManagerMongo {
	getProducts = async (filter, specs) => {
		return await productModel.paginate(filter, specs);
	};

	getProductByID = async (pid) => {
		return await productModel.find({ _id: pid });
	};

	addProduct = async (newProduct) => {
		return await productModel.create(newProduct);
	};

	updateProduct = async (pid, productToUpdate) => {
		return await productModel.updateOne({ _id: pid }, productToUpdate);
	};

	deleteProduct = async (pid) => {
		return await productModel.updateOne({ _id: pid }, { status: false });
	};

	getProductCategories = async () => {
		return await productModel.distinct("category");
	};
}

const productMgr = new ProductManagerMongo();

module.exports = { ProductManagerMongo, productMgr };
