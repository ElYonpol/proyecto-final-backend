const bcrypt = require("bcrypt");

const createHash = async (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const checkValidPassword = async ({ password, hashedPassword }) =>{
	console.log("password es:", password);
	console.log("hashedpassword es:", hashedPassword);
	return bcrypt.compareSync(password, hashedPassword);

}

module.exports = {
	createHash,
	checkValidPassword,
};
