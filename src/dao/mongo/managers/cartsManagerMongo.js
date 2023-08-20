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
		return await this.cartModel.create({ products: [] });
	};

	delete = async (cid) => {
		return await cartModel.updateOne({ _id: cid }, { products: [] });
	};

	addProductToCartbyId = async (cid, products, user) => {
		return await this.cartModel.updateOne({ _id: cid }, { products: products });
	};

	deleteProductFromCart = async (cid, pid) => {
		const cart = await this.getById(cid);
		const productsInCart = cart[0].products;

		const productFoundIndex = productsInCart.findIndex(
			(product) => product.pid._id.toString() === pid
		);

		if (productFoundIndex === -1) {
			throw new Error(
				`El producto con id: ${pid} no existe en el carrito de id: ${cid}`
			);
		}

		productsInCart.splice(productFoundIndex, 1);

		return await cartModel.updateOne({ _id: cid }, { products: productsInCart });
	};

	getProductsByCartId = async (cid) => {
		const cart = await this.getById(cid);
		return cart[0].products ?? [];
	};

	updateCartById = async (cid, products) => {
		return await cartModel.updateOne({ _id: cid }, { products: products });
	};
}

const cartMgr = new CartDaoMongo();

module.exports = { CartDaoMongo, cartMgr };
