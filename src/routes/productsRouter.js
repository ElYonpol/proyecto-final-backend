const express = require("express");
const { io } = require("../config/server.js");
const { uploader } = require("../utils/uploader.js");
const { productMgr } = require("../dao/productManagerMongo.js");

const productsRouter = express.Router();

// GET http://localhost:8080/api/products
productsRouter.get("/", async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const {
			docs,
			hasPrevPage,
			prevPage,
			hasNextPage,
			nextPage,
			totalPages,
			prevLink,
			nextLink,
		} = await productMgr.getProducts({ page, limit });

		if (!docs) return res.status(400).send("No hay productos");

		res.status(200).render("homeTable", {
			productList: docs,
			hasPrevPage,
			prevPage,
			hasNextPage,
			nextPage,
			totalPages,
			prevLink,
			nextLink,
			page,
			limit,
		});
	} catch (error) {
		console.log(error);
	}
});

// GET http://localhost:8080/api/products/pid
productsRouter.get("/:pid", async (req, res) => {
	try {
		const { pid } = req.params;
		const resp = await productMgr.getProductByID(parseInt(pid));
		if (!resp)
			return res
				.status(404)
				.json({ error: `El producto con el id ${pid} no fue encontrado.` });
		res.json({ resp });
	} catch (error) {
		console.log(error);
	}
});

// POST http://localhost:8080/api/products/pid
productsRouter.post("/", async (req, res) => {
	try {
		const newProduct = req.body;
		const resp = await productMgr.addProduct(newProduct);
		res.send(resp);
		if (resp) io.emit("newProductAdded", resp);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

// PUT http://localhost:8080/api/products/pid
productsRouter.put("/:pid", async (req, res) => {
	try {
		const pid = parseInt(req.params.pid);
		const productToUpdate = { ...req.body, id: pid };
		const resp = await productMgr.updateProduct(pid, productToUpdate);
		if (!resp)
			return res
				.status(404)
				.json({ error: `El producto con el id ${pid} no fue encontrado.` });
		res.send(resp);
	} catch (error) {
		console.log(error);
	}
});

// DELETE http://localhost:8080/api/products/pid
productsRouter.delete("/:pid", async (req, res) => {
	try {
		const pid = parseInt(req.params.pid);
		const resp = await productMgr.deleteProduct(pid);
		if (!resp)
			return res
				.status(404)
				.json({ error: `El producto con el id ${pid} no fue encontrado.` });
		res.status(204).send();
	} catch (error) {
		console.log(error);
	}
});

module.exports = productsRouter;
