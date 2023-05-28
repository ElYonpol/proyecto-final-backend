const { objConfig } = require("../config/config.js");
const MongoSingleton = require("../utils/MongoSingleton.js");

let ProductsDaos;
let UsersDaos;
let CartsDaos;
let OrdersDaos;
let ContactsDaos;

switch (objConfig.persistence) {
	case "MONGO":
		MongoSingleton.getInstance();
		const ProductDaoMongo = require("./mongo/managers/productsMongo.js");
		ProductsDaos = ProductDaoMongo;

		const UserDaoMongo = require("./mongo/managers/userMongo.js");
		UsersDaos = UserDaoMongo;

		const OrderDaoMongo = require("./mongo/managers/orderMongo.js");
		OrdersDaos = OrderDaoMongo;

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

module.exports = { ProductsDaos, UsersDaos, OrdersDaos };
