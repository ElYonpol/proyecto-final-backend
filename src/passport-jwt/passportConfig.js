const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2");
const { userService, cartService } = require("../service/service.js");
const { cartMgr } = require("../dao/mongo/managers/cartsManagerMongo.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const { commander } = require("../utils/commander.js");
const { logger } = require("../utils/logger.js");
const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

let GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
let GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const initializePassport = () => {
	passport.use(
		"login",
		new LocalStrategy(
			{
				passReqToCallback: true, // acceso al req
			},
			async (req, username, password, done) => {
				try {
					let userArray = await userService.getByEmail(username.toLowerCase());
					let user = userArray[0];
					if (!user) {
						logger.warning("Revisar usuario y contraseña");
						return done(null, false);
					}
					const isValidPassword = await checkValidPassword({
						password,
						hashedPassword: user.password,
					});
					if (!isValidPassword) {
						logger.warning("Revisar usuario y contraseña");
						return done(null, false);
					}
					return done(null, user);
				} catch (error) {
					logger.error(error);
					return done("Error al hacer el login: " + error);
				}
			}
		)
	);

	passport.use(
		"register",
		new LocalStrategy(
			{
				passReqToCallback: true, // acceso al req
				usernameField: "email", //el campo username será el email
			},
			async (req, username, password, done) => {
				try {
					const { first_name, last_name } = req.body;
					// buscar el usuario en la base de datos
					let user = await userService.getByEmail(username.toLowerCase());
					if (user.length) {
						logger.error("El usuario ya existe");
						return done(null, false);
					}
					// hash password
					const hashedPassword = await createHash(password);
					// crear carrito y usuario
					let emptyCart = await cartMgr.create();

					let newUser = {
						first_name,
						last_name,
						email: username,
						username,
						password: hashedPassword,
						cart: emptyCart._id,
					};

					let result = await userService.createItem(newUser);
					return done(null, result);
				} catch (error) {
					logger.error(error);
					return done("Error al generar el usuario: " + error);
				}
			}
		)
	);

	passport.use(
		"github",
		new GitHubStrategy(
			{
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: "http://localhost:8080/api/sessions/githubcallback",
				scope: ["user:email"],
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userService.getByEmail(profile.emails[0].value);
					if (!user) {
						let cart = await cartService.createItem();
						let newUser = {
							first_name: profile._json.name ?? "Desconocido",
							last_name: profile._json.name ?? "Desconocido",
							email: profile.emails[0].value,
							username: profile.username,
							password: "Desconocido",
							cart,
						};
						let result = await userService.createItem(newUser);
						return done(null, result);
					} else {
						return done(null, user);
					}
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (uid, done) => {
		try {
			const user = await userService.getItem(uid);
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
};

module.exports = { initializePassport };
