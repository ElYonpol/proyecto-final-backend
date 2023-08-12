const { objConfig } = require("../config/config.js");
const MongoSingleton = require("../utils/MongoSingleton.js");

let ProductsDaos;
let UsersDaos;
let OrdersDaos;
let CartsDaos;
let MessagesDaos;
let TicketDaos;
let EmailsDaos;
let TokensDaos;
let ContactsDaos;

switch (objConfig.persistence) {
	case "MONGO":
		MongoSingleton.getInstance();

		const {	ProductDaoMongo	} = require("./mongo/managers/productsManagerMongo.js");
		ProductsDaos = ProductDaoMongo;

		const { UserDaoMongo } = require("./mongo/managers/usersManagerMongo.js");
		UsersDaos = UserDaoMongo;

		const { OrderDaoMongo } = require("./mongo/managers/ordersManagerMongo.js");
		OrdersDaos = OrderDaoMongo;

		const { CartDaoMongo } = require("./mongo/managers/cartsManagerMongo.js");
		CartsDaos = CartDaoMongo;

		const {	MessageDaoMongo	} = require("./mongo/managers/messagesManagerMongo.js");
		MessagesDaos = MessageDaoMongo;

		const { TicketDaoMongo } = require("./mongo/managers/ticketsManagerMongo.js");
		TicketDaos = TicketDaoMongo;

		const { EmailDaoMongo } = require("./mongo/managers/emailsManagerMongo.js");
		EmailsDaos = EmailDaoMongo;

		const { TokenDaoMongo } = require("./mongo/managers/tokensManagerMongo.js");
		TokensDaos = TokenDaoMongo;

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
		// const ProductDaoMongo = require("./mongo/managers/productsManagerMongo.js");
		// ProductsDaos = ProductDaoMongo;
		break;
}

module.exports = {
	ProductsDaos,
	UsersDaos,
	OrdersDaos,
	CartsDaos,
	MessagesDaos,
	TicketDaos,
	EmailsDaos,
	TokensDaos,
};
