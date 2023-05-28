const { ProductManagerMongo } = require("../dao/mongo/productManagerMongo.js");
const { CartManagerMongo } = require("../dao/mongo/cartManagerMongo.js");
const { MessageManagerMongo } = require("../dao/mongo/messageManagerMongo.js");
const { OrderDaoMongo } = require("../dao/mongo/orderMongo.js");
const UserRepository = require("../repositories/userRepository.js");
const OrderRepository = require("../repositories/orderRepository.js");
const { UsersDaos, OrdersDaos, ProductsDaos } = require("../dao/factory.js");



const  userService = new UserRepository(new UsersDaos());
const orderService = new OrderRepository(new OrdersDaos());
const productService = new ProductManagerMongo();
const cartService = new CartManagerMongo();
const messageService = new MessageManagerMongo();

module.exports = {
	userService,
	productService,
	cartService,
	messageService,
	orderService,
};
