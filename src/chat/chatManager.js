const { chatMgr } = require("../dao/messageManagerMongo.js");

const chatDriver = (io, socket) => {
	socket.on("chatMessage", async (messageData) => {
		try {
			messageData = { ...messageData, message: messageData.message.toString() };
			await messageManager.addMessage(messageData);
			const messages = await messageManager.getMessages();
			io.emit("messageLogs", messages);
		} catch (error) {
			socket.emit("error", error);
		}
	});

	socket.on("authenticated", async (newUser) => {
		try {
			const messages = await messageManager.getMessages();
			io.emit("messageLogs", messages);
			socket.broadcast.emit("newUser", newUser);
		} catch (error) {
			socket.emit("error", error);
		}
	});
};

module.exports = chatDriver;
