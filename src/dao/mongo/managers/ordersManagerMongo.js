const { orderModel } = require("../models/ordersModelMongo.js");

class OrderDaoMongo {
	constructor() {
		this.orderModel = orderModel;
	}

	get = async (filter, specs) => {
		return await this.orderModel.paginate(filter, specs);
	};

	getById = async (oid) => {
		return await this.orderModel.findOne({ _id: oid });
	}

	create = async (newOrder) => {
		return await this.orderModel.create(newOrder);
	}

	update = async (oid, orderToUpdate) => {
		return await this.orderModel.updateOne({ _id: oid }, orderToUpdate);
	};

	delete = async (oid) => {
		return await this.orderModel.updateOne({ _id: oid }, { status: false });
	};
}

const orderMgr = new OrderDaoMongo();

module.exports = { OrderDaoMongo, orderMgr };
