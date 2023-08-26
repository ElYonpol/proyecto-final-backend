const RepositoryGeneric = require("./repositoryGeneric.js");

class TicketRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico
	async getTicketByUserId(uid) {
		return await this.dao.getTicketByUserId(uid);
	}
	async getTicketByTicketCode(ticketCode) {
		return await this.dao.getTicketByTicketCode(ticketCode);
	}
}

module.exports = TicketRepository;
