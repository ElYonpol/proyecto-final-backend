const express = require("express");
const { cartMgr } = require("../dao/cartManagerMongo.js");

const cartRouter = express.Router();

cartRouter.get("/", async (req, res) => {
	try {
		const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
		const respCarts = await cartManager.getCarts();
		const limit = req.query.limit;
		let limitedCarts = [];
		if (limit) limitedCarts = respCarts.slice(0, limit);
		res
			.status(200)
			.json({ status: "success", payload: limit ? limitedCarts : respCarts });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

cartRouter.get("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const respProducts = await cartMgr.getProductsByCartId(cid);
		res.status(200).json({ status: "success", payload: respProducts });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

cartRouter.post("/", async (req, res) => {
	try {
		const resp = await cartMgr.addCart();
		res.status(201).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const pid = req.params.pid;
		let products = await cartMgr.getProductsByCartId(cid);
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
		const resp = await cartMgr.addProductByCartId(cid, products);

		res.status(201).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const pid = req.params.pid;
		const resp = await cartMgr.deleteProductFromCart(cid, pid);
		res.status(200).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

cartRouter.put("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const newProducts = req.body;
		const resp = await cartManager.updateProductsByCartId(cid, products);
		res.status(201).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

cartRouter.delete("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const resp = await cartMgr.deleteAllProductsByCartId(cid);
		res.status(200).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const pid = req.params.pid;
		const { quantity } = req.body;
		const resp = await cartMgr.updateProductFromCart(cid, pid, quantity);
		res.status(201).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

module.exports = cartRouter;
