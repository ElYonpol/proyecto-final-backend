const { objConfig } = require("../config/config.js");
const MongoSingleton = require("../utils/MongoSingleton.js");

let ProductsDaos;
let UsersDaos;
let OrdersDaos;
let CartsDaos;
let MessagesDaos
let ContactsDaos;

switch (objConfig.persistence) {
	case "MONGO":
		MongoSingleton.getInstance();
		const ProductDaoMongo = require("./mongo/managers/productsMongo.js");
		ProductsDaos = ProductDaoMongo;

		const UserDaoMongo = require("./mongo/managers/usersMongo.js");
		UsersDaos = UserDaoMongo;

		const OrderDaoMongo = require("./mongo/managers/ordersMongo.js");
		OrdersDaos = OrderDaoMongo;

		const CartDaoMongo = require("./mongo/managers/cartsMongo.js");
		CartsDaos = CartDaoMongo;

		//Falta agregar el de carts, orders, contact en todos los case
		break;
	case "MEMORY":
		const ProductDaoMemory = require("./memory/productsMemory.js");
		ProductsDaos = ProductDaoMemory;
		break;
	case "FILE":
		const ProductDaoFile = require("./files/productsFiles.js");
		ProductsDaos = ProductDaoFile;
		break;

	default:
		// MongoSingleton.getInstance();
		// const ProductDaoMongo = require("./mongo/managers/productsMongo.js");
		// ProductsDaos = ProductDaoMongo;
		break;
}

module.exports = { ProductsDaos, UsersDaos, OrdersDaos, CartsDaos };
