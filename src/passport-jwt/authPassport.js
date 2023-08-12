const passport = require("passport");

const authPassport = (strategy) => {
	return async (req, res, next) => {
		passport.authenticate(strategy, (err, user, info) => {
			console.log("User de authPassport es:",user)
			if (err) return next(err);
			if (!user)
				return res.status(401).send({
					status: "error authPassport",
					error: info.message ? info.message : info.toString(),
				});
			req.user = user;
			next();
		})(req, res, next);
	};
};

module.exports = { authPassport };
