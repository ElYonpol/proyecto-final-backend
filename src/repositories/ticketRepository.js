const RepositoryGeneric = require("./repositoryGeneric.js");

class TicketRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico
}

module.exports = TicketRepository;
