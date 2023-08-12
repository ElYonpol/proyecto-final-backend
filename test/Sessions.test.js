const chai = require("chai");
const { createHash, checkValidPassword } = require("../src/utils/bcryptPass");

const expect = chai.expect;

describe("Testing Bcrypt", () => {
	it("El servicio debe devolver un hasheo efectivo para el password", async function () {
		const password = "pass123";
		const hashedPassword = await createHash(password);

		expect(hashedPassword).to.not.equal(password);
	});
	it("El password debe compararse de manera efectiva con el original", async function () {
		const password = "pass123";
		const hashedPassword = await createHash(password);

		const isValid = await checkValidPassword({ password, hashedPassword });
		expect(isValid).to.be.true;
	});
	it("Si el password se modifica, debe fallar la comparación con el original", async function () {
		const password = "pass123";
		let hashedPassword = await createHash(password);
		hashedPassword += "+";

		const isValid = await checkValidPassword({ password, hashedPassword });
		expect(isValid).to.be.false;
	});
});
