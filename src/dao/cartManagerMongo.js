const fs = require("fs");
const { cartModel } = require("./models/cartsModelMongo");

class CartManagerMongo {
	// constructor(path) {
	// 	this.path = path;
	// }

	getCarts = async ({ page, limit, query = "" }) => {
		try {
			// const resp = await productModel.find().lean();
			const resp = await cartModel.paginate({}, { limit, page, lean: true });
			return resp;
		} catch (error) {
			return error;
		}
	};

	getCartByID = async (cid) => {
		const carts = await this.getCarts();

		const cartFound = carts.find((cart) => cart.id === cid);

		if (!cartFound) {
			console.error("Cart not found");
			return null;
		}

		return cartFound.products;
	};

	addProductToCart = async (cid, pid) => {
		try {
			const cart = await this.getCartByID(cid);

			const cartFoundIndex = cart.findIndex((cart) => cart.id === cid);

			if (cartFoundIndex === -1) return console.error("Cart not found");

			const productFoundIndex = cart[cartFoundIndex].products.findIndex(
				(prod) => prod.id === pid
			);
			if (productFoundIndex === -1) {
				return await cartModel.updateOne(
					{ _id: cid },
					products[productFoundIndex]
				);
			} else {
				return await cartModel.updateOne(
					{ _id: cid },
					(products[productFoundIndex].quantity += 1)
				);
			}
		} catch (error) {}
	};

	addCart = async () => {
		const carts = await this.getCarts();

		const newCart = {
			id: 1,
			products: [],
		};

		carts.length === 0
			? (newCart.id = 1)
			: (newCart.id = carts[carts.length - 1].id + 1);

		return await cartModel.create(newCart);
	};

	deleteProductFromCart = async (cid, pid) => {
		const cart = await this.getCartByID(cid);

		const productFoundIndex = cart.products.findIndex(
			(product) => product.id === pid
		);

		if (productFoundIndex === -1) {
			console.error("Product not found");
			return null;
		}

		console.log("El producto a eliminar es:", cart.products[productFoundIndex]);

		return await cartModel.deleteOne({ _id: pid });
	};
}

const cartMgr = new CartManagerMongo();

module.exports = { CartManagerMongo, cartMgr };
