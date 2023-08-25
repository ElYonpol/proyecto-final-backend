const express = require("express");
const { generateSocketServer } = require("./config/socket.js");
const path = require("node:path");
const { correctThumbnails, concatenateURLCarts } = require("./config/helpers.js");
const routerApp = require("./routes/index.js");
const handlebars = require("express-handlebars");
const { initializePassport } = require("./passport-jwt/passportConfig.js");
const passport = require("passport");
const cors = require("cors");
const { addLogger, logger } = require("./utils/logger.js");
const session = require("express-session");
const pkg = require("connect-mongo");
const { create } = pkg;
const { objConfig } = require("./config/config.js");
// const { processFunction } = require("./utils/process.js");
const app = express();

// MIDDLEWARES START =================================================
// handlebars config _______________________________________________________
const hbs = handlebars.create({
	helpers: { correctThumbnails, concatenateURLCarts },
	partialsDir: path.join(__dirname, "views/partials"),
});
app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handlebars config _______________________________________________________

// logger config _______________________________________________________
app.use(addLogger);
// logger config _______________________________________________________

// process config _______________________________________________________
// processFunction()
// process config _______________________________________________________

// cors config _______________________________________________________
app.use(cors());
// cors config _______________________________________________________

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.resolve(__dirname, "../public")));

// passport y session config _______________________________________________________
app.use(
	session({
		store: create({
			mongoUrl: objConfig.mongoURL,
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		}),
		secret: objConfig.sessionSecretKey,
		cookie: { maxAge: Number(objConfig.sessionCookieMaxAge) },
		saveUninitialized: true,
		resave: true,
	})
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
// passport y session config _______________________________________________________

// Routes config _______________________________________________________
app.use(routerApp);
// Routes config _______________________________________________________
// MIDDLEWARES END =================================================

// server config _______________________________________________________
const PORT = process.env.PORT || 8080;
const SERVER_URL = process.env.SERVER_URL || "http://localhost:";

const initServer = () => {
	const httpServer = app.listen(PORT, (err) => {
		if (err) {
			logger.error("Error al iniciar el servidor (app.js)");
		}
		logger.info(
			`Servidor iniciado en el puerto ${PORT}. (${SERVER_URL}:${PORT}) (app.js)`
		);
	});
	generateSocketServer(httpServer);
};
// server config _______________________________________________________

module.exports = { initServer };
