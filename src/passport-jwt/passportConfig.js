const passport = require("passport");
const { userService } = require("../service/index.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2");
const { commander } = require("../utils/commander.js");

const { mode } = commander.opts();

require("dotenv").config({
	path: mode === "development" ? "./.env.development" : "./.env.production",
});

let GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
let GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const initializePassport = () => {
	passport.use(
		"register", // Acá va el nombre de la estrategia
		new LocalStrategy(
			{
				passReqToCallback: true, // acceso al req
				usernameField: "email",
			},
			async (req, email, password, done) => {
				try {
					const { first_name, last_name, username, role} = req.body;
					// buscar el usuario en la base de datos
					const user = await userService.getUserByEmail(email);
					console.log({ user });
					// done si  hay usuario
					if (user) {
						done(null, false, { message: "El usuario ya existe" });
					}
					// hash password
					const hashedPassword = createHash(password);
					// crear usuario
					const newUser = {
						first_name,
						last_name,
						email,
						username,
						role,
						password: hashedPassword,
					};
					const result = await userService.addUser(newUser);

					// done con el usuario
					return done(null, result);
				} catch (error) {
					console.log(error);
					return done(error);
				}
			}
		)
	);

	passport.use(
		"login",
		new LocalStrategy(
			{
				usernameField: "email",
			},
			async (email, password, done) => {
				try {
					const user = await userService.getUserByEmail(email);
					if (!user) {
						return done(null, false);
					}
					const isValidPassword = checkValidPassword({
						hashedPassword: user.password,
						password,
					});
					if (!isValidPassword) {
						done(null, false);
					}
				} catch (error) {
					console.log(error);
					return done(error);
				}
			}
		)
	);

	passport.use(
		"github",
		new GitHubStrategy(
			{
				//Nota para Tutor: Link en el mensaje de la entrega
				//clientID: colocar aquí el clientSecret pasado en la entrega
				//clientSecret: colocar aquí el clientID pasado en la entrega
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: "http://localhost:8080/session/githubcallback",
				scope: ["user:email"],
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					console.log({ email: profile.emails[0].value });
					const user = await userService.getUserByEmail({
						email: profile.emails[0].value,
					});
					if (!user) {
						const newUser = {
							first_name: profile._json.name,
							last_name: profile._json.name,
							username: profile.username,
							email: profile.emails[0].value,
						};
						console.log({ newUser });
						const result = await userService.addUser(newUser);
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
			const user = await userService.getUserByID(uid);
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
};

module.exports = {
	initializePassport,
};
