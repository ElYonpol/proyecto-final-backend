const { orderService } = require("../service/service");

class OrderController {
	async getOrders(req, res) {
		try {
			const query = {};
			const specs = {};
			let orders = await orderService.getItems(query, specs);
			res.status(200).send({ status: "success", payload: orders });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async getOrder(req, res) {
		try {
			const oid = req.params.oid;
			const order = await orderService.getItem(oid);
			res.status(200).send({ status: "success", payload: order });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async createOrder(req, res) {
		try {
			const newOrder = req.body;
			const result = await orderService.createItem(newOrder);
			res.status(200).send({ status: "success", payload: result });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async updateOrder(req, res) {
		try {
			const oid = req.params.oid;
			const orderToUpdate = req.body;
			const resp = await orderService.updateItem(oid, orderToUpdate);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async deleteOrder(req, res) {
		try {
			const oid = req.params.oid;
			const resp = await orderService.deleteItem(oid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
}

module.exports = { OrderController };
