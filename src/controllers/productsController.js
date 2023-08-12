const { productService } = require("../service/service.js");
const { SERVER_URL, PORT } = require("../config/setups.js");

class ProductController {
	getProducts = async (req, res) => {
		try {
			const { page = 1, limit = 10, sort = null } = req.query;

			const query = req.query.query ? JSON.parse(req.query.query) : {};

			const specs = sort
				? { limit, page, sort: { price: sort }, lean: true }
				: { limit, page, lean: true };

			const resp = await productService.getItems(query, specs);

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
				status: "error getting products",
				payload: { error: error, message: error.message },
			});
		}
	};

	getProduct = async (req, res) => {
		try {
			const pid = req.params.pid;
			const resp = await productService.getItem(pid);
			if (!resp)
				return res
					.status(404)
					.json({ error: `El producto con el id ${pid} no fue encontrado.` });
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error getting product",
				payload: { error: error, message: error.message },
			});
		}
	};

	createProduct = async (req, res) => {
		try {
			const newProduct = req.body;
			const resp = await productService.createItem(newProduct);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error creating product",
				payload: { error: error, message: error.message },
			});
		}
	};

	updateProduct = async (req, res) => {
		try {
			const pid = req.params.pid;
			const productToUpdate = req.body;
			const resp = await productService.updateItem(pid, productToUpdate);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error updating product",
				payload: { error: error, message: error.message },
			});
		}
	};

	deleteProduct = async (req, res) => {
		try {
			const pid = req.params.pid;
			const resp = await productService.deleteItem(pid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};
}

module.exports = ProductController;
