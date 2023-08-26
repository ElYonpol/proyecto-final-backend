const { ticketModel } = require("../models/ticketsModelMongo.js");

class TicketDaoMongo {
	constructor() {
		this.ticketModel = ticketModel;
	}

	get = async (filter, specs) => {
		return await this.ticketModel.paginate(filter, specs);
	};

	getById = async (tid) => {
		return await this.ticketModel.find({ _id: tid }).lean();
	};

	create = async (newTicket) => {
		return await this.ticketModel.create(newTicket);
	};

	update = async (tid, ticketToUpdate) => {
		return await this.ticketModel.updateOne({ _id: tid }, ticketToUpdate);
	};

	delete = async (tid) => {
		return await this.ticketModel.updateOne({ _id: tid }, { status: false });
	};

	getTicketByUserId = async (uid) => {
		return await this.ticketModel.find({ purchaser: uid }).lean();
	};

	getTicketByTicketCode = async (ticketCode) => {
		return await this.ticketModel.findOne({ ticketCode: ticketCode }).lean();
	};
}

const ticketMgr = new TicketDaoMongo();

module.exports = { TicketDaoMongo, ticketMgr };
