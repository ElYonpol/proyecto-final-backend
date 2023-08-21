const {
	cartService,
	ticketService,
	productService,
} = require("../service/service.js");

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
			// Verifico si el producto no fue creado por el usuario intentando agregarlo al carrito
			const productToAdd = await productService.getItem(pid);
			if (req.user[0]._id === productToAdd[0].owner) {
				throw new Error("El producto es de su propiedad");
			}

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
			// const cid = req.user.cart;
			const { userEmail } = req.user[0];
			const productsInCart = await cartService.getProductsByCartId(cid);
			const cart = await cartService.getItem(cid);
			let productsInPurchase = [];
			let productsToKeepInCart = [];
			let ticketAmount = 0;
			let updatedProductStock = 0;
			let purchaseQuantity = 0;
			// Verifico stock por producto y armo array de productos a comprar
			for (let i = 0; i < productsInCart.length; i++) {
				const product = productsInCart[i];
				const productInfo = await productService.getItem(product.pid._id);
				const productStock = productInfo[0].stock;
				purchaseQuantity = product.quantity;

				if (productStock >= purchaseQuantity) {
					ticketAmount += productInfo[0].price * product.quantity;
					productsInPurchase.push(product);
					// Actualizo el stock del producto comprado restando la cantidad comprada del stock actual
					updatedProductStock = productStock - purchaseQuantity;
					await productService.updateItem(product.pid._id, {
						stock: updatedProductStock,
					});
				} else {
					productsToKeepInCart.push(product);
				}
			}
			// Actualizo el carrito con los productos que quedan por falta de stock
			await cartService.updateCartById(cart[0]._id, productsToKeepInCart);

			// Proceso la compra
			if (productsInPurchase.length > 0) {
				// Genero el ticket de compra
				const randomTicketNumber = () => {
					Math.random().toString(36).substring(2, 18);
				};
				const newTicket = {
					ticketCode: randomTicketNumber(),
					purchaseDateTime: Date.now(),
					totalTicketAmount: ticketAmount,
					purchaser: userEmail,
					products: productsInPurchase,
				};
				const ticket = await ticketService.createItem(newTicket);
				console.log("Ticket creado:", { ticket });

				res.status(200).json({ status: "success", payload: newTicket });
			} else {
				// Carrito vacío
				if (productsInPurchase.length === 0) {
					res.status(400).json({
						error: "Error: El carrito está vacío",
						productIds,
					});
				}
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
				status: "error finalizePurchase",
				payload: { error: error, message: error.message },
			});
		}
	};
}

module.exports = CartController;
