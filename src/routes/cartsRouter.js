const express = require("express");
const CartController = require("../controllers/cartsController.js");

const cartRouter = express.Router();

const { getCarts, getCart, createCart, updateProductInCart, updateProductsByCartId, deleteProductFromCart, updateProductFromCart,deleteCart } =
	new CartController();

// GET http://localhost:8080/api/carts
cartRouter.get("/", getCarts);

// GET http://localhost:8080/api/carts/:cid
cartRouter.get("/:cid", getCart);

// POST http://localhost:8080/api/carts
cartRouter.post("/", createCart);

// POST http://localhost:8080/api/carts/:cid/products/:pid
cartRouter.post("/:cid/products/:pid", updateProductInCart);

// DELETE http://localhost:8080/api/carts/:cid/products/:pid
cartRouter.delete("/:cid/products/:pid", deleteProductFromCart);

// PUT http://localhost:8080/api/carts/:cid
cartRouter.put("/:cid", updateProductsByCartId);

// DELETE http://localhost:8080/api/carts/:cid
cartRouter.delete("/:cid", deleteCart);

// PUT http://localhost:8080/api/carts/:cid/products/:pid
cartRouter.put("/:cid/products/:pid", updateProductFromCart);

module.exports = cartRouter;
