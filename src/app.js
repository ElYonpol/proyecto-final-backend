const express = require("express");
const { generateSocketServer } = require("./config/socket.js");
const path = require("path");
const { correctThumbnails } = require("./config/helpers.js");
const routerApp = require("./routes/index.js");
const handlebars = require("express-handlebars");
const { initializePassport } = require("./passport-jwt/passportConfig.js");
const passport = require("passport");
const cors = require("cors");
// const flash = require("connect-flash");
// const { processFunction } = require("./utils/process.js");

const app = express();

// server config _______________________________________________________
const PORT = process.env.PORT || 8080;
const SERVER_URL = process.env.SERVER_URL || "http://localhost:";

const httpServer = app.listen(PORT, (err) => {
	if (err) {
		console.error("Error al iniciar el servidor (app.js)");
	}
	console.log(
		`Servidor iniciado en el puerto ${PORT}. (${SERVER_URL}:${PORT}) (app.js)`
	);
});
generateSocketServer(httpServer);
// server config _______________________________________________________

// handlebars config _______________________________________________________
const hbs = handlebars.create({
	helpers: { correctThumbnails },
	partialsDir: path.join(__dirname, "views/partials"),
});
app.engine("handlebars", hbs.engine);
// app.engine("handlebars", handlebars.engine({ helpers: { correctThumbnails } }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// handlebars config _______________________________________________________

// Middlewares _______________________________________________________
// passport config _______________________________________________________
initializePassport();
app.use(passport.initialize());
// passport config _______________________________________________________

// process config _______________________________________________________
// processFunction()
// process config _______________________________________________________

// flash config _______________________________________________________
// app.use(flash());
// flash config _______________________________________________________

// cors config _______________________________________________________
app.use(cors());
// app.use(cors({ origin: `${SERVER_URL}:${PORT}`, methods: ["GET", "POST", "PUT", "DELETE"] }));
// cors config _______________________________________________________

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.resolve(__dirname, "../public")));
// Middlewares _______________________________________________________

// Routes config _______________________________________________________
app.use(routerApp);
// Routes config _______________________________________________________

// Global Variables _______________________________________________________
// app.use((req, res, next) => {
// 	res.locals.success_msg = req.flash("success_msg");
// 	res.locals.error_msg = req.flash("error_msg");
// 	next();
// });
// Global Variables _______________________________________________________
