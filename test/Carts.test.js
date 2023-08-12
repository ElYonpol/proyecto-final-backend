const { mongoose } = require("mongoose");
const Assert = require("assert");
const { ProductDaoMongo } = require("../src/dao/mongo/managers/productsManagerMongo.js");
const { CartDaoMongo } = require("../src/dao/mongo/managers/cartsManagerMongo.js");

mongoose.connect("mongodb://127.0.0.1:27017/basepruebasJP");

const assert = Assert.strict;

describe("Testing Cart Dao", () => {
	before(function () {
		this.productsDao = new ProductDaoMongo();
		this.cartsDao = new CartDaoMongo();
	});
	beforeEach(function () {
		mongoose.connection.collections.carts.drop();
		this.timeout(5000);
	});
	it("Nuestro dao debe poder obtener un array con carritos", async function () {
		console.log("Product Dao", this.productsDao);
		console.log("Cart Dao", this.cartsDao);
		const result = await this.cartsDao.get();
		assert.strictEqual(Array.isArray(result), true);
	});
	it("Nuestro dao debe poder agregar un producto a un carrito de la base de datos, correctamente", async function () {
		let mockProduct = {
			code: "abc1232126",
			category: "Prótesis",
			thumbnails: ["/static/assets/images/cartCard--nuevo.webp"],
			title: "nuevoProducto",
			description: "Desc nuevo producto",
			price: 1500,
			stock: 13,
		};
		const newCart = await this.cartsDao.create()
		assert.ok(newCart._id);
		const newProduct = await this.productsDao.create(mockProduct);
		assert.ok(newProduct._id);
		const result = await this.cartsDao.addProductToCartbyId({ cid: newCart._id, products: newProduct._id, quantity: 1 });
		assert.ok(result._id);
		assert.deepStrictEqual(result.products, []);
	});
	it("Nuestro dao debe poder obtener un carrito por id", async function () {
		const result = await this.cartsDao.create()
		assert.ok(result._id);
		const cartDb = await this.cartsDao.getById({ cid: result._id });
		assert.strictEqual(typeof cartDb, "object");
	});
});
