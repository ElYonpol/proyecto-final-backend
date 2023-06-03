const { orderModel } = require("../models/ordersModelMongo.js");

class OrderDaoMongo {
	constructor() {
		this.orderModel = orderModel;
	}

	get = async (filter, specs) => {
		return await this.orderModel.paginate(filter, specs);
	};

	async getOrdersById(oid) {
		return await this.orderModel.findOne({ _id: oid });
	}

	async createOrder(newOrder) {
		return await this.orderModel.create(newOrder);
	}

	async updateOrder(oid) {}
	async deleteOrder(oid) {}
}

const orderMgr = new OrderDaoMongo();

module.exports = { OrderDaoMongo, orderMgr };
