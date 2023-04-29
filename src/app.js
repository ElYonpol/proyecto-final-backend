const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { correctThumbnails } = require("./config/helpers.js");
const { objConfig } = require("./config/config.js");
const routerApp = require("./routes/mainRouter.js");
const cookieRouter = require("./routes/cookie.router.js");
const sessionRouter = require("./routes/session.router.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const handlebars = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 8080;

// socket server config _______________________________________________________
const httpServer = app.listen(PORT, (err) => {
	if (err) {
		console.error("Error al iniciar el servidor");
	}
	console.log(`Servidor iniciado en el puerto ${PORT}`);
});
// const io = new Server(httpServer);
// socket server config _______________________________________________________

// handlebars config _______________________________________________________
app.engine("handlebars", handlebars.engine({ helpers: { correctThumbnails } }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handlebars config _______________________________________________________

// _________________________________ cookies y session________________________
app.use(cookieParser("CookieJPP3"));
app.use(
	session({
		secret: "secretJPPE",
		resave: true,
		saveUninitialized: true,
	})
);
app.use("/cookie", cookieRouter);
app.use("/session", sessionRouter);
// _________________________________ cookies y session________________________

// MongoDB
objConfig.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.resolve(__dirname, "../public")));

app.use(routerApp);


/* // _________________________________ socket________________________

io.on("connection", (socket) => {
	console.log("Nuevo cliente conectado");
	socket.on("message", (data) => {
		console.log(data);
	});

	socket.emit(
		"evento_para_socket_individual",
		"Este mensaje sólo lo debe recibir el socket actual"
	);

	socket.broadcast.emit(
		"evento_para_todos_menos_el_socket_actual",
		"Este mensaje lo verán todos los sockets conectados, MENOS el socket actual desde el que se envió el mensaje"
	);

	io.emit(
		"evento_para_todos",
		"Este mensaje lo reciben todos los sockets conectados"
	);
}); */
