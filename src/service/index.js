const {
	CartManagerMongo,
} = require("../dao/mongo/managers/cartsManagerMongo.js");
const {
	MessageManagerMongo,
} = require("../dao/mongo/managers/messagesManagerMongo.js");
const UserRepository = require("../repositories/userRepository.js");
const OrderRepository = require("../repositories/orderRepository.js");
const ProductRepository = require("../repositories/productRepository.js");

const { UsersDaos, OrdersDaos, ProductsDaos } = require("../dao/factory.js");

const userService = new UserRepository(new UsersDaos());
const orderService = new OrderRepository(new OrdersDaos());
const productService = new ProductRepository(new ProductsDaos());
const cartService = new CartManagerMongo();
const messageService = new MessageManagerMongo();

module.exports = {
	userService,
	productService,
	cartService,
	messageService,
	orderService,
};
