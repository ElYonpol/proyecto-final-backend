const express = require("express");
const path = require("path");
const { Server } = require("./config/server.js");
const { correctThumbnails } = require("./config/helpers.js");
const { objConfig } = require("./config/config.js");
const routerApp = require("./routes/mainRouter.js");
const handlebars = require("express-handlebars");
const { initializePassport } = require("./passport-jwt/passportConfig.js");
const passport = require("passport");
// const { processFunction } = require("./utils/process.js");

const app = express();
const PORT = objConfig.PORT || 8080;

// server config _______________________________________________________
const httpServer = app.listen(PORT, (err) => {
	if (err) {
		console.error("Error al iniciar el servidor (app.js)");
	}
	console.log(`Servidor iniciado en el puerto ${PORT} (app.js)`);
});
// server config _______________________________________________________

// handlebars config _______________________________________________________
app.engine("handlebars", handlebars.engine({ helpers: { correctThumbnails } }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handlebars config _______________________________________________________

// passport config _______________________________________________________
initializePassport();
app.use(passport.initialize());
// app.use(passport.session());
// passport config _______________________________________________________

// process config _______________________________________________________
// processFunction()
// process config _______________________________________________________

// MongoDB config _______________________________________________________
objConfig.connectDB();
// MongoDB config _______________________________________________________

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.resolve(__dirname, "../public")));

app.use(routerApp);

module.exports = { httpServer };
