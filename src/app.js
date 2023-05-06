const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { correctThumbnails } = require("./config/helpers.js");
const { objConfig } = require("./config/config.js");
const routerApp = require("./routes/mainRouter.js");
const handlebars = require("express-handlebars");
const { initializePassport } = require("./passport-jwt/passportConfig.js");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 8080;

// socket server config _______________________________________________________
const httpServer = app.listen(PORT, (err) => {
	if (err) {
		console.error("Error al iniciar el servidor");
	}
	console.log(`Servidor iniciado en el puerto ${PORT}`);
});
// socket server config _______________________________________________________

// handlebars config _______________________________________________________
app.engine("handlebars", handlebars.engine({ helpers: { correctThumbnails } }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handlebars config _______________________________________________________

// passport config _______________________________________________________
initializePassport()
app.use(passport.initialize());
// passport config _______________________________________________________

// MongoDB config _______________________________________________________
objConfig.connectDB();
// MongoDB config _______________________________________________________

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.resolve(__dirname, "../public")));

app.use(routerApp);
