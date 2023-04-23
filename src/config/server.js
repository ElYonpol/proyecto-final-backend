const http = require("http");
const app = require("../app.js");
const { generateIoServer } = require("./io.js");

const server = http.createServer(app);
const io = generateIoServer(server);

module.exports = { server, io };
