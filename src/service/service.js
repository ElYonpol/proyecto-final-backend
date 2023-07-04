const UserRepository = require("../repositories/userRepository.js");
const OrderRepository = require("../repositories/orderRepository.js");
const ProductRepository = require("../repositories/productRepository.js");
const CartRepository = require("../repositories/cartRepository.js");
const MessageRepository = require("../repositories/messageRepository.js");
const EmailRepository = require("../repositories/emailRepository.js");
const TicketRepository = require("../repositories/ticketRepository.js");

const {
	UsersDaos,
	OrdersDaos,
	ProductsDaos,
	CartsDaos,
	MessagesDaos,
	TicketDaos,
	EmailsDaos,
} = require("../dao/factory.js");

const userService = new UserRepository(new UsersDaos());
const orderService = new OrderRepository(new OrdersDaos());
const productService = new ProductRepository(new ProductsDaos());
const cartService = new CartRepository(new CartsDaos());
const messageService = new MessageRepository(new MessagesDaos());
const ticketService = new TicketRepository(new TicketDaos());
const emailService = new EmailRepository(new EmailsDaos());

module.exports = {
	userService,
	orderService,
	productService,
	cartService,
	messageService,
	ticketService,
	emailService,
};
