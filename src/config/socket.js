const { Server } = require("socket.io");
const { messageMgr } = require("../dao/mongo/managers/messagesManagerMongo.js");
const { productMgr } = require("../dao/mongo/managers/productsManagerMongo.js");
const { cartMgr } = require("../dao/mongo/managers/cartsManagerMongo.js");
const CartController = require("../controllers/cartsController.js");
const { logger } = require("../utils/logger.js");

// const MessageController = require("../controllers/messagesController.js");

// const {
// 	getMessages,
// 	getMessageById,
// 	createMessage,
// 	updateMessage,
// 	deleteMessage,
// } = new MessageController();

const generateSocketServer = (httpServer) => {
	const io = new Server(httpServer);
	io.on("connection", (socket) => {
		logger.info("Nuevo cliente conectado en socket");

		// socket.on("disconnect", (data) => {
		// 	logger.info("Cliente desconectado");
		// 	io.emit("disconnect", "Cliente desconectado.");
		// });

		// INICIO Segmento socket para mensajes chat____________________________
		socket.on("chatMessage", async (messageData) => {
			try {
				const { user, message } = messageData;
				messageString = message.toString();
				let messageDataOK = {};
				messageDataOK = {
					user,
					message: messageString,
				};
				await messageMgr.create(messageDataOK);
				const messages = await messageMgr.get();
				io.emit("messageLogs", messages);
			} catch (error) {
				socket.emit("error", error);
			}
		});

		socket.on("authenticated", async (newUser) => {
			try {
				const messages = await messageMgr.get();
				io.emit("messageLogs", messages);
				socket.broadcast.emit("newUser", newUser);
			} catch (error) {
				socket.emit("error", error);
			}
		});
		// FIN Segmento socket para mensajes chat____________________________

		// INICIO Segmento socket para Real Time Products____________________
		socket.on("newProduct", async (newProduct) => {
			try {
				await productMgr.create(newProduct);
				io.emit("newProductAdded", newProduct);
			} catch (error) {
				socket.emit("error", error);
			}
		});

		socket.on("newCart", async () => {
			try {
				let response = await cartMgr.create();
				let data = await response.json();
				cid = data.payload._id;
				io.emit("newCartCreated", cid);
			} catch (error) {
				socket.emit("error", error);
			}
		});

		socket.on("addProductToCart", async (cid, pid) => {
			try {
				let response = await CartController.addProductToCartbyId(cid, pid);
				let data = await response.json();
				io.emit("productAddedToCart", { cid, pid });
			} catch (error) {
				socket.emit("error", error);
			}
		});
		// FIN Segmento socket para Real Time Products____________________
	});
	return io;
};

module.exports = { generateSocketServer };
