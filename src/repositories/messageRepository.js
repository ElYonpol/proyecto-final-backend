const RepositoryGeneric = require("./repositoryGeneric");

class MessageRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico (ejemplo el DTO)
	
}

module.exports = MessageRepository;
