const { faker } = require("@faker-js/faker");

faker.locale = "es";

const generateProducts = () => {
	return {
		title: faker.commerce.productName(),
		price: faker.commerce.price(),
		department: faker.commerce.department(),
		stock: faker.random.numeric(1),
		id: faker.database.mongodbObjectId(),
		image: faker.image.image(),
	};
};

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

module.exports = { generateUser, generateProducts };
