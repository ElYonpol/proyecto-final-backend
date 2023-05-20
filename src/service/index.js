const { UserManagerMongo } = require("../dao/userManagerMongo.js");
const { ProductManagerMongo } = require("../dao/productManagerMongo.js");
const { CartManagerMongo } = require("../dao/cartManagerMongo.js");
const { MessageManagerMongo } = require("../dao/messageManagerMongo.js");

const userService = new UserManagerMongo();
const productService = new ProductManagerMongo();
const cartService = new CartManagerMongo();
const messageService = new MessageManagerMongo();

module.exports = { userService, productService, cartService, messageService };
