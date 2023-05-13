const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");

const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

let cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies("CookieJPP3");
	}
	return token;
};

//Estrategia de passport
const initializePassport = () => {
	passport.use(
		"jwt", // Es el nombre de la estrategia
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
				secretOrKey: "secretJPPE",
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
};

module.exports = { initializePassport };
