const fs = require("fs");
const { logger } = require("../../utils/logger");

class CartManager {
	constructor(path) {
		this.path = path;
	}

	getCarts = async () => {
		try {
			if (fs.existsSync(this.path)) {
				const carts = await fs.promises.readFile(this.path, "utf-8");
				return JSON.parse(carts);
			}
			throw new Error();
		} catch (error) {
			return [];
		}
	};

	getCartByID = async (cid) => {
		const carts = await this.getCarts();

		const cartFound = carts.find((cart) => cart.id === cid);

		if (!cartFound) {
			logger.error("Cart not found");
			return null;
		}

		// console.table(cartFound);

		return cartFound.products;
	};

	addProductToCart = async (cid, pid) => {
		try {
			const carts = await this.getCarts();

			const cartFoundIndex = carts.findIndex((cart) => cart.id === cid);

			if (cartFoundIndex === -1) return logger.error("Cart not found");

			const productFoundIndex = carts[cartFoundIndex].products.findIndex(
				(prod) => prod.id === pid
			);
			if (productFoundIndex === -1) {
				carts[cartFoundIndex].products.push({ id: pid, quantity: 1 });
			} else {
				carts[cartFoundIndex].products[productFoundIndex].quantity += 1;
			}

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(carts, null, 2),
				"utf-8"
			);
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

		carts.push(newCart);

		await fs.promises.writeFile(
			this.path,
			JSON.stringify(carts, null, 2),
			"utf-8"
		);

		return newCart;
	};
}

const cartMgr = new CartManager("./src/files/carts.json");

module.exports = { CartManager, cartMgr };
