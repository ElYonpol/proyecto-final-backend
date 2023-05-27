const UserDto = require("../dto/userDto");
const RepositoryGeneric = require("./repositoryGeneric");

class UserRepository extends RepositoryGeneric {
	constructor(dao) {
		super(dao);
	}

	//Métodos extras o redefiniciones a los del genérico (ejemplo el DTO)
}

module.exports = UserRepository;
