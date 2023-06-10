const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { userService } = require("../service/service.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const { commander } = require("../utils/commander.js");

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
			async (req, email, password, done) => {
				try {
					const { first_name, last_name, username, role } = req.body;
					// buscar el usuario en la base de datos
					const user = await userService.getByEmail(email);
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
					const result = await userService.createItem(newUser);
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
					const user = await userService.getByEmail(email);
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
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: "http://localhost:8080/session/githubcallback",
				scope: ["user:email"],
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					console.log({ email: profile.emails[0].value });
					const user = await userService.getByEmail({
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
						const result = await userService.createItem(newUser);
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
