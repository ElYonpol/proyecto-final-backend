const bcrypt = require("bcrypt");

const createHash = async (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const checkValidPassword = async ({ password, hashedPassword }) =>
	bcrypt.compareSync(password, hashedPassword);

module.exports = {
	createHash,
	checkValidPassword,
};
