const { Server } = require("socket.io");
const chatDriver = require("../chat/chatManager.js");

const generateIoServer = (httpServer) => {
	const io = new Server(httpServer);
	io.on("connection", (socket) => {
		console.log("Nuevo cliente conectado");
		socket.on("message", (data) => {
			console.log(data);
		});

		chatDriver(io, socket);

		socket.on("disconnect", (socket) => {
			console.log("Cliente desconectado");
		});
	});
	return io;
};

module.exports = { generateIoServer };
