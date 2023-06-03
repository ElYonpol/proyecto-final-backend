const { cartModel } = require("../models/cartsModelMongo.js");

class CartDaoMongo {
	constructor() {
		this.cartModel = cartModel;
	}

	get = async (filters) => {
		return await this.cartModel.find(filters).lean();
	};

	getById = async (cid) => {
		return await this.cartModel.find({ _id: cid }).lean();
	};

	create = async () => {
		return await cartModel.create({});
	};

	delete = async (cid) => {
		return await cartModel.deleteOne({ _id: cid });
	};

	addProductToCartbyId = async (cid, products) => {
		return await cartModel.updateOne({ _id: cid }, { products: products });
	};

	deleteProductFromCart = async (cid, pid) => {
		const cart = await this.getById(cid);
		const products = cart[0].products;

		const productFoundIndex = products.findIndex(
			(product) => product.pid._id.toString() === pid
		);

		if (productFoundIndex === -1) {
			throw new Error(
				`El producto con id: ${pid} no existe en el carrito de id: ${cid}`
			);
		}

		products.splice(productFoundIndex, 1);

		return await cartModel.updateOne({ _id: cid }, { products: products });
	};

	updateProductFromCart = async (cid, pid, quantity) => {
		const cart = await this.getById(cid);
		const products = cart[0].products;
		const productFoundIndex = products.findIndex(
			(product) => product.pid._id.toString() === pid
		);
		if (productFoundIndex === -1)
			throw new Error(
				`El producto con id: ${pid} no existe en el carrito de id: ${cid}`
			);
		products[productFoundIndex].quantity = quantity;
		return await cartModel.updateOne({ _id: cid }, { products: products });
	};

	getProductsByCartId = async (cid) => {
		const cart = await this.getById(cid);
		return cart[0].products ?? [];
	};

	deleteAllProductsByCartId = async (cid) => {
		return await cartModel.updateOne({ _id: cid }, { products: [] });
	};

	updateProductsByCartId = async (cid, products) => {
		return await cartModel.updateOne({ _id: cid }, { products: products });
	};
}

const cartMgr = new CartDaoMongo();

module.exports = { CartDaoMongo, cartMgr };
