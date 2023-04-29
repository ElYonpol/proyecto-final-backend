const express = require("express");
const { io } = require("../config/server.js");
const { productMgr } = require("../dao/productManagerMongo.js");
const {
	productsCreationSchema,
	productsUpdatingSchema,
} = require("../validation/productsValidation.js");
const { objectsValidation } = require("../middleware/validator.js");
const { SERVER_URL, PORT } = require("../config/setups.js");

const productsRouter = express.Router();

// GET http://localhost:8080/api/products
productsRouter.get("/", async (req, res) => {
	try {
		const { page = 1, limit = 10, sort = null } = req.query;
		const query = req.query.query ? JSON.parse(req.query.query) : {};
		const specs = sort
			? { limit, page, sort: { price: sort }, lean: true }
			: { limit, page, lean: true };
		const resp = await productMgr.getProducts(query, specs);
		const currPage = resp.page;
		const prevPage = resp.prevPage;
		const nextPage = resp.nextPage;

		res.status(200).json({
			status: "success",
			payload: resp.docs,
			totalPages: resp.totalPages,
			prevPage: resp.prevPage,
			nextPage: resp.nextPage,
			page: currPage,
			hasPrevPage: resp.hasPrevPage,
			hasNextPage: resp.hasNextPage,
			prevLink: prevPage
				? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${prevPage}`
				: null,
			nextLink: nextPage
				? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${nextPage}`
				: null,
		});
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

// GET http://localhost:8080/api/products/pid
productsRouter.get("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const resp = await productMgr.getProductByID(pid);
		if (!resp)
			return res
				.status(404)
				.json({ error: `El producto con el id ${pid} no fue encontrado.` });
		res.status(200).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

// POST http://localhost:8080/api/products/pid
productsRouter.post(
	"/",
	objectsValidation(productsCreationSchema),
	async (req, res) => {
		try {
			const newProduct = req.body;
			const resp = await productMgr.addProduct(newProduct);
			res.status(200).json({ status: "success", payload: resp });
			if (resp) io.emit("newProductAdded", resp);
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
);

// PUT http://localhost:8080/api/products/pid
productsRouter.put(
	"/:pid",
	objectsValidation(productsUpdatingSchema),
	async (req, res) => {
		try {
			const pid = req.params.pid;
			const productToUpdate = req.body;
			const resp = await productMgr.updateProduct(pid, productToUpdate);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
);

// DELETE http://localhost:8080/api/products/pid
productsRouter.delete("/:pid", async (req, res) => {
	try {
		const pid = req.params.pid;
		const resp = await productMgr.deleteProduct(pid);
		res.status(200).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

module.exports = productsRouter;
