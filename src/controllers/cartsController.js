const { cartService, ticketService } = require("../service/service.js");

class CartController {
	getCarts = async (req, res) => {
		try {
			const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

			const resp = await cartService.getItems(filters);

			const limit = req.query.limit;

			let limitedCarts = [];
			if (limit) limitedCarts = resp.slice(0, limit);

			res
				.status(200)
				.json({ status: "success", payload: limit ? limitedCarts : resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	getCart = async (req, res) => {
		try {
			const cid = req.params.cid;
			const cart = await cartService.getItem(cid);
			res.status(200).json({ status: "success", payload: cart });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	createCart = async (req, res) => {
		try {
			const resp = await cartService.createItem();
			res.status(201).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	deleteCart = async (req, res) => {
		try {
			const cid = req.params.cid;
			const resp = await cartService.deleteItem(cid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	updateProductInCart = async (req, res) => {
		try {
			const cid = req.params.cid;
			const pid = req.params.pid;
			let products = await cartService.getItem(cid);
			let productExists = false;
			//Si el producto existe le agrego 1 unidad
			for (let i = 0; i < products.length; i++) {
				const product = products[i];
				if (product.pid._id.toString() === pid) {
					product.quantity += 1;
					productExists = true;
					break;
				}
			}

			if (!productExists) products = [...products, { pid: pid, quantity: 1 }];
			const resp = await cartService.addProductToCartbyId(cid, products);

			res.status(201).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	deleteProductFromCart = async (req, res) => {
		try {
			const cid = req.params.cid;
			const pid = req.params.pid;
			const resp = await cartService.deleteProductFromCart(cid, pid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	updateProductsByCartId = async (req, res) => {
		try {
			const cid = req.params.cid;
			const newProducts = req.body;
			const resp = await cartService.updateProductsByCartId(cid, newProducts);
			res.status(201).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	updateProductFromCart = async (req, res) => {
		try {
			const cid = req.params.cid;
			const pid = req.params.pid;
			const { quantity } = req.body;
			const resp = await cartService.updateProductFromCart(cid, pid, quantity);
			res.status(201).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	finalizePurchase = async (req, res) => {
		try {
			const cid = req.params.cid;
			const cart = await cartService.getItem(cid);
			const productsInPurchase = [];
			// Verifico stock por producto y armo array de productos a comprar
			for (const item of cart[0].products) {
				const product = item.pid;
				const purchaseQuantity = item.quantity;

				if (product.stock >= purchaseQuantity) {
					productsInPurchase.push({
						product: product._id,
						purchaseQuantity,
					});
				}
			}

			// Proceso la compra
			if (productsInPurchase.length > 0) {
				// Actualizo el stock de los productos comprados restando la cantidad comprada del stock actual
				for (const item of productsInPurchase) {
					const pid = item.product;
					const purchaseQuantity = item.purchaseQuantity;
					const resp = await productService.updateItem(pid, {
						$inc: { stock: -purchaseQuantity },
					});
				}

				// Genero el ticket - PENDIENTE AGREGAR ticketCode, totalTicketAmount, purchaser
				const ticket = await ticketService.createItem(productsInPurchase);

				// Limpio el carrito
				const productsToKeepInCart = cart[0].products.filter((item) => {
					return !productsInPurchase.find((p) =>
						p.product.equals(item.product)
					);
				});
				cart[0].products = productsToKeepInCart;
				await cart.save();

				// Enviar la respuesta
				res.status(200).json({ ticket });
			} else {
				// No se puede realizar la compra, productos con falta de stock
				const productIds = cart[0].products.map((item) => item.product);
				res.status(400).json({
					error:
						"Error: No se puede realizar la compra en los siguientes productos por falta de stock: ",
					productIds,
				});
			}
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};
}

module.exports = CartController;
