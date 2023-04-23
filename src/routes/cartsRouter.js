const express = require("express");
const { cartMgr } = require("../dao/cartManagerMongo.js");

const cartRouter = express.Router();

cartRouter.post("/", async (req, res) => {
	const resp = await cartMgr.addCart();
	res.send(resp);
});

cartRouter.get("/:cid", async (req, res) => {
	const cid = parseInt(req.params.cid);
	const resp = await cartMgr.getCartByID(cid);
	if (!resp)
		return res
			.status(404)
			.json({ error: `El carrito con el id ${cid} no fue encontrado.` });
	res.send(resp);
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
	const cid = parseInt(req.params.cid);
	const pid = parseInt(req.params.pid);
	const resp = await cartMgr.addProductToCart(cid, pid);
	res.send(resp);
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
	const cid = parseInt(req.params.cid);
	const pid = parseInt(req.params.pid);
	const resp = await cartMgr.deleteProductFromCart(cid, pid);
	res.send(resp);
});

cartRouter.put("/:cid", async (req, res) => {
	const cid = parseInt(req.params.cid);
	const { newProducts } = req.body;
	const cart = await cartMgr.getCartByID(cid);
	

	const resp = await cartMgr.deleteProductFromCart(cid, pid);
	res.status(201).send({
		products: resp,
		message: "Carrito Modificado",
	});
});

module.exports = cartRouter;
