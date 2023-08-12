const { mongoose } = require("mongoose");
const Assert = require("assert");
const { ProductDaoMongo } = require("../src/dao/mongo/managers/productsManagerMongo.js");

mongoose.connect("mongodb://127.0.0.1:27017/basepruebasJP");

const assert = Assert.strict;

describe("Testing Product Dao", () => {
	before(function () {
		this.productsDao = new ProductDaoMongo();
	});
	beforeEach(function () {
		mongoose.connection.collections.products.drop();
		this.timeout(5000);
	});
	it("Nuestro dao debe poder obtener un array con productos", async function () {
		console.log("Product Dao", this.productsDao);
		const result = await this.productsDao.get();
		assert.strictEqual(Array.isArray(result), true);
	});
	it("Nuestro dao debe poder agregar un producto a la base de datos, correctamente", async function () {
		let mockProduct = {
			code: "abc1232126",
			category: "Prótesis",
			thumbnails: ["/static/assets/images/cartCard--nuevo.webp"],
			title: "nuevoProducto",
			description: "Desc nuevo producto",
			price: 1500,
			stock: 13,
		};
		const result = await this.productsDao.create(mockProduct);
		assert.ok(result._id);
		assert.deepStrictEqual(result.owner, []);
	});
	it("Nuestro dao debe poder obtener un producto por id", async function () {
		let mockProduct = {
			code: "abc1232129",
			category: "Prótesis",
			thumbnails: ["/static/assets/images/cartCard--nuevo.webp"],
			title: "nuevoProducto 2",
			description: "Desc nuevo producto 2",
			price: 1500,
			stock: 13,
		};
		const result = await this.productsDao.create(mockProduct);
		const productDb = await this.productsDao.getById({ pid: result._id });
		assert.strictEqual(typeof productDb, "object");
	});
});
