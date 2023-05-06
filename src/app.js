const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { correctThumbnails } = require("./config/helpers.js");
const { objConfig } = require("./config/config.js");
const routerApp = require("./routes/mainRouter.js");
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

// MongoDB
objConfig.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.resolve(__dirname, "../public")));

app.use(routerApp);
