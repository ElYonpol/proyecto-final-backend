const { Server } = require("socket.io");
const { messageMgr } = require("../dao/mongo/managers/messagesMongo.js");
const { productMgr } = require("../dao/mongo/managers/productsMongo.js");

const generateProductSocketServer = (httpServer) => {
	const io = new Server(httpServer);
	io.on("connection", (socket) => {
		console.log("Nuevo cliente conectado en productos");

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
				const messages = await messageMgr.get()
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

		// socket.on("disconnect", (data) => {
		// 	console.log("Cliente desconectado");
		// 	io.emit("disconnect", "Cliente desconectado.");
		// });
	});
	return io;
};

module.exports = { generateProductSocketServer };
