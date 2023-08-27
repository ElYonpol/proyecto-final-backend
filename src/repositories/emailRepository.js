const RepositoryGeneric = require("./repositoryGeneric.js");

class EmailRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico (ejemplo el DTO)
	async getByReceiver(emailAddress) {
		return await this.dao.getByReceiver(emailAddress);
	}

	async sendTestEmail() {
		return await this.dao.sendTestEmail();
	}
}

module.exports = EmailRepository;
