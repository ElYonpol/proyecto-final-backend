const { Server } = require("socket.io");
// const MessageController = require("../controllers/messagesController.js");
const { messageMgr } = require("../dao/mongo/managers/messagesManagerMongo.js");

// const {
// 	getMessages,
// 	getMessageById,
// 	addMessage,
// 	updateMessage,
// 	deleteMessage,
// } = new MessageController();

const generateIoServer = (httpServer) => {
	const io = new Server(httpServer);
	io.on("connection", (socket) => {
		console.log("Nuevo cliente conectado");

		socket.on("chatMessage", async (messageData) => {
			try {
				const { user, message } = messageData;
				messageString = message.toString();
				let messageDataOK = {};
				messageDataOK = {
					user,
					message: messageString,
				};
				await messageMgr.addMessage(messageDataOK);
				const messages = await messageMgr.getMessages();
				io.emit("messageLogs", messages);
			} catch (error) {
				socket.emit("error", error);
			}
		});

		socket.on("authenticated", async (newUser) => {
			try {
				const messages = await messageMgr.getMessages();
				io.emit("messageLogs", messages);
				socket.broadcast.emit("newUser", newUser);
			} catch (error) {
				socket.emit("error", error);
			}
		});

		// socket.on("disconnect", (data) => {
		// 	console.log("Cliente desconectado");
		// 	io.emit("disconnect", "Cliente desconectado.");
		// });
	});
	return io;
};

module.exports = { generateIoServer };
