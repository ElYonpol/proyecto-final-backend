const { MessageManagerMongo } = require("../dao/mongo/managers/messagesManagerMongo.js");
const UserRepository = require("../repositories/userRepository.js");
const OrderRepository = require("../repositories/orderRepository.js");
const ProductRepository = require("../repositories/productRepository.js");
const CartRepository = require("../repositories/cartRepository.js");


const { UsersDaos, OrdersDaos, ProductsDaos, CartsDaos } = require("../dao/factory.js");

const userService = new UserRepository(new UsersDaos());
const orderService = new OrderRepository(new OrdersDaos());
const productService = new ProductRepository(new ProductsDaos());
const cartService = new CartRepository(new CartsDaos);
const messageService = new MessageManagerMongo();

module.exports = {
	userService,
	productService,
	cartService,
	messageService,
	orderService,
};
