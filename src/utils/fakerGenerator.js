const { faker } = require("@faker-js/faker");
const generateProducts = require("./generateProducts");
faker.locale = "es";

const generateUser = () => {
	let numOfProducts = parseInt(
		faker.random.numeric(1, { bannedDigits: ["0"] })
	);
	let products = [];
	for (let i = 0; i < numOfProducts; i++) {
		products.push(generateProducts());
	}
	return {
		name: faker.name.firstName(),
		lastname: faker.name.lastName(),
		sexo: faker.name.sex(),
		birthdate: faker.date.birthdate(),
		phone: faker.phone.number(),
		products: products,
		image: faker.internet.avatar(),
		id: faker.database.mongodbObjectId(),
		email: faker.internet.email(),
	};
};

module.exports = { generateUser };
