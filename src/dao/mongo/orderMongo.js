const { orderModel } = require("./models/ordersModelMongo.js");

class OrderDaoMongo {
	constructor() {
		this.orderModel = orderModel;
	}

	async get() {
		return await this.orderModel.find({});
	}

	async getById(oid) {
		return await this.orderModel.findOne({ _id: oid });
	}

	async create(newOrder) {
		return await this.orderModel.create(newOrder);
	}

	async update(oid) {}
	async delete(oid) {}
}

const orderMgr = new OrderDaoMongo();

module.exports = OrderDaoMongo;
