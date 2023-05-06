const { Router } = require("express");
const passport = require("passport");
const { passportCall } = require("../passport-jwt/passportCall.js");
const { authorization } = require("../middleware/auth.middleware.js");

const router = Router();

// Versión anterior con passport
// router.get(
// 	"/current",
// 	passport.authenticate("jwt", { session: false }),
// 	(req, res) => {
// 		res.send(req.user);
// 	}
// );

router.get(
	"/current",
	passportCall("jwt"),
	authorization("user"),
	(req, res) => {
		res.send(req.user);
	}
);

module.exports = router;
