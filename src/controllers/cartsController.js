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
				status: "error getCarts",
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
				status: "error getCart",
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
				status: "error createCart",
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
				status: "error deleteCart",
				payload: { error: error, message: error.message },
			});
		}
	};

	addProductToCartbyId = async (req, res) => {
		try {
			const cid = req.params.cid;
			const pid = req.params.pid;
			const user = req.user.user;
			// let arrayProductsInCart = await cartService.getItem(cid);
			let productsInCart = await cartService.getProductsByCartId(cid);
			let productExists = false;
			//Si el producto existe le agrego 1 unidad
			for (let i = 0; i < productsInCart.length; i++) {
				const product = productsInCart[i];
				if (product.pid._id.toString() === pid) {
					product.quantity += 1;
					productExists = true;
					break;
				}
			}

			if (!productExists)
				productsInCart = [...productsInCart, { pid: pid, quantity: 1 }];

			const resp = await cartService.addProductToCartbyId(
				cid,
				productsInCart,
				user
			);

			res.status(201).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error addProductToCartbyId",
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
				status: "error deleteProductFromCart",
				payload: { error: error, message: error.message },
			});
		}
	};

	finalizePurchase = async (req, res) => {
		try {
			const cid = req.params.cid;
			const { userEmail } = req.user[0];
			const cart = await cartService.getItem(cid);
			const productsInPurchase = [];
			const productsToKeepInCart = [];
			const totalTicketAmount = 0;
			// Verifico stock por producto y armo array de productos a comprar
			for (const item of cart[0].products) {
				const product = item.pid;
				const purchaseQuantity = item.quantity;

				if (product.stock >= purchaseQuantity) {
					totalTicketAmount += product.pid.price * product.quantity
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
					await productService.updateItem(pid, { $inc: { stock: -purchaseQuantity } });
				}

				// Genero el ticket - TODO: PENDIENTE AGREGAR ticketCode, totalTicketAmount, purchaser
				const randomTicketNumber = () => {
					Math.random().toString(36).substring(2, 18);
				};
				const newTicket = {
					ticketCode: randomTicketNumber(),
					purchaseDateTime: Date.now(),
					totalTicketAmount: totalTicketAmount,
					purchaser: userEmail,
					products: productsInPurchase,
				};
				const ticket = await ticketService.createItem(newTicket);

				// Limpio el carrito
				productsToKeepInCart = cart[0].products.filter((item) => {
					return !productsInPurchase.find((p) =>
						p.product.equals(item.product)
					);
				});
				await cartService.updateCartById(cart[0]._id, productsToKeepInCart);

				// Enviar la respuesta
				res.status(200).json({ status: "success", payload: newTicket });
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
