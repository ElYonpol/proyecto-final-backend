const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { userService, cartService } = require("../service/service.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const { commander } = require("../utils/commander.js");
const { logger } = require("../utils/logger.js");

const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

let GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
let GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies(process.env.COOKIE_NAME);
	}
	return token;
};

const initializePassport = () => {
	passport.use(
		"jwt", // Es el nombre de la estrategia
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
				secretOrKey: process.env.JWT_SECRET_KEY,
			},
			async (jwt_payload, done) => {
				try {
					return done(null, jwt_payload);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.use(
		"register",
		new LocalStrategy(
			{
				passReqToCallback: true, // acceso al req
				usernameField: "email",
			},
			async (req, username, password, done) => {
				try {
					const { first_name, last_name } = req.body;
					// buscar el usuario en la base de datos
					let user = await userService.getByEmail(username); //
					logger.info({ user });
					// done si  hay usuario
					if (user) {
						logger.error("El usuario ya existe");
						return done(null, false);
					}
					// hash password
					const hashedPassword = await createHash(password);
					// crear carrito y usuario
					let cart = await cartService.createItem();
					logger.info("El cart creado es: ", cart);
					let newUser = {
						first_name,
						last_name,
						email: username,
						username,
						password: hashedPassword,
						cart,
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
		"login",
		new LocalStrategy(
			{
				// passReqToCallback: true,
				// usernameField: "email",
			},
			async (username, password, done) => {
				try {
					let user = await userService.getByUsername(username);
					console.log("user es:", user)
					if (!user[0]) {
						logger.warning("Revisar usuario y contraseña");
						return done(null, false);
					}
					// const isValidPassword = await checkValidPassword({
					// 	hashedPassword: user[0].password,
					// 	password,
					// });
					// if (!isValidPassword) return done(null, false);
					done(null, user[0]);
				} catch (error) {
					logger.error(error);
					return done("Error al hacer el login: " + error);
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
				callbackURL: "http://localhost:8080/session/githubcallback",
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
