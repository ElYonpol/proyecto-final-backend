const { orderService } = require("../service");

class OrderController {
	async getOrders(req, res) {
		try {
			let orders = orderService.getItems();
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
	async updateOrder(req, res) {}
	async deleteOrder(req, res) {}
}

module.exports = { OrderController };
