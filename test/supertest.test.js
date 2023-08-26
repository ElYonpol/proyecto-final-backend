const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing Proyecto Final JP", () => {
	describe("Test de productos", () => {
		it("El endpoint POST /api/products debe crear producto correctamente", async () => {
			const productMock = {
				code: "abc123212",
				category: "Prótesis",
				thumbnails: ["/static/assets/images/cartCard--nuevo.webp"],
				title: "nuevoProducto",
				description: "Desc nuevo producto",
				price: 1500,
				stock: 13,
			};

			const { statusCode, ok, _body } = await requester
				.post("/api/products")
				.send(productMock);
			expect(_body.payload).to.have.property("_id");
			expect(_body.payload.adopted).to.equal(false);
		});
		it("El endpoint POST /api/products debe dar error al crear un producto sin código", async () => {
			const productMock = {
				// code: "abc1232126",
				category: "Prótesis",
				thumbnails: ["/static/assets/images/cartCard--nuevo.webp"],
				title: "nuevoProducto",
				description: "Desc nuevo producto",
				price: 1500,
				stock: 13,
			};

			const { statusCode, ok, _body } = await requester
				.post("/api/products")
				.send(productMock);
			expect(statusCode).to.equal(400);
		});

		it("El endpoint GET /api/products debe obtener un array de productos, correctamente", async () => {
			const { statusCode, ok, _body } = await requester.get("/api/products");
			expect(ok).to.be.equal(true);
			expect(statusCode).to.equal(200);
		});
	});

	describe("Test avanzado Session", () => {
		let cookie;
		it("Debe registrar un usuario correctamente", async () => {
			const userMock = {
				first_name: "Pedro",
				last_name: "Pérez",
				email: "pedro@gmail.com",
				username: "pedro@gmail.com",
				password: "123",
			};
			const { _body } = await requester
				.post("/api/sessions/register")
				.send(userMock);

			expect(_body.payload).to.be.ok;
		});

		it("El servicio debe loguear un usuario y devolver una cookie", async () => {
			const userMock = {
				email: "pedro@gmail.com",
				password: "123",
			};
			const result = await requester.post("/api/sessions/login").send(userMock);
			const cookieResult = result.headers["set-cookie"][0];

			expect(cookieResult).to.be.ok;
			cookie = {
				name: cookieResult.split("=")[0],
				value: cookieResult.split("=")[1],
			};
			expect(cookie.name).to.be.ok.and.equal("coderCookie");
			expect(cookie.value).to.be.ok;
		});

		it("El servicio debe enviar la cookie del usuario y desestructurar correctamente", async () => {
			const { _body } = await requester
				.get("/api/sessions/current")
				.set("Cookie", [`${cookie.name}=${cookie.value}`]);
			expect(_body.payload.email).to.be.equal("pedro@gmail.com");
		});
	});
});
