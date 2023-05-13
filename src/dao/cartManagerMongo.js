const { cartModel } = require("./models/dbMongo/cartsModelMongo.js");

class CartManagerMongo {
	getCarts = async (filters) => {
		return await cartModel.find(filters).lean();
	};

	getCartByID = async (cid) => {
		return await cartModel.find({ _id: cid }).lean();
	};

	addCart = async () => {
		return await cartModel.create({});
	};

	deleteCart = async (cid) => {
		return await cartModel.deleteOne({ _id: cid });
	};

	addProductToCartbyId = async (cid, products) => {
		return await cartModel.updateOne({ _id: cid }, { products: products });
	};

	deleteProductFromCart = async (cid, pid) => {
		const cart = await this.getCartByID(cid);
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
		const cart = await this.getCartById(cid);
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
		const cart = await this.getCartByID(cid);
		return cart[0].products ?? [];
	};

	deleteAllProductsByCartId = async (cid) => {
		return await cartModel.updateOne({ _id: cid }, { products: [] });
	};

	updateProductsByCartId = async (cid, products) => {
		return await cartModel.updateOne({ _id: cid }, { products: products });
	};
}

const cartMgr = new CartManagerMongo();

module.exports = { CartManagerMongo, cartMgr };
