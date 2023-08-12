const { Router } = require("express");
const CartController = require("../controllers/cartsController.js");

const cartsRouter = Router();

const {
	getCarts,
	getCart,
	createCart,
	addProductToCartbyId,
	updateProductsByCartId,
	deleteProductFromCart,
	updateProductFromCart,
	deleteCart,
	finalizePurchase,
} = new CartController();

// GET http://localhost:8080/api/carts
cartsRouter.get("/", getCarts);

// GET http://localhost:8080/api/carts/:cid
cartsRouter.get("/:cid", getCart);

// POST http://localhost:8080/api/carts
cartsRouter.post("/", createCart);

// POST http://localhost:8080/api/carts/:cid/products/:pid
cartsRouter.post("/:cid/products/:pid", addProductToCartbyId);

// PUT http://localhost:8080/api/carts/:cid
cartsRouter.put("/:cid", updateProductsByCartId);

// DELETE http://localhost:8080/api/carts/:cid/products/:pid
cartsRouter.delete("/:cid/products/:pid", deleteProductFromCart);

// PUT http://localhost:8080/api/carts/:cid/products/:pid
cartsRouter.put("/:cid/products/:pid", updateProductFromCart);

// DELETE http://localhost:8080/api/carts/:cid
cartsRouter.delete("/:cid", deleteCart);

// GET http://localhost:8080/api/carts/:cid/purchase
cartsRouter.get("/:cid/purchase", finalizePurchase); //Debe finalizar el proceso de compra (clase 16 - slide 47)

module.exports = cartsRouter;
