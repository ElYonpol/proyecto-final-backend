const { Router } = require("express");
const { faker } = require("@faker-js/faker");
faker.locale = "es";
const generateProducts = require("../utils/generateProducts");
// const { generateUser } = require("../utils/fakerGenerator.js");

const mockingRouter = Router();

mockingRouter.get("/", async (req, res) => {
	try {
		let numOfProducts = parseInt(
			faker.random.numeric(2, { bannedDigits: ["0"] })
		);
		let products = [];
		for (let i = 0; i < numOfProducts; i++) {
			products.push(generateProducts());
		}
		// let users = [];
		// for (let i = 0; i < 100; i++) {
		// 	users.push(generateUser());
		// }
		res.send({ status: "success", payload: products });
	} catch (error) {
		res.status(400).json({
			status: "error mockingRouter",
			payload: {
				error: error,
				message: error.message,
			},
		});
	}
});

module.exports = mockingRouter;
