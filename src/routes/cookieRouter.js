const { Router } = require("express");
const { logger } = require("../utils/logger");

const cookieRouter = Router();

cookieRouter.get("/set", (req, res) => {
	res
		.cookie(process.env.COOKIE_NAME, "Este es el valor de la cookie", {
			maxAge: 60 * 60 * 1000 * 24,
			httpOnly: true,
		})
		.send("Cookie set");
});

cookieRouter.get("/", (req, res) => {
	res.render("login", {});
});

cookieRouter.get("/get", (req, res) => {
	res.send(req.cookies);
});
// con firma
cookieRouter.post("/setSigned", (req, res) => {
	const { username, password } = req.body;
	logger.info(username, password);

	res
		.cookie("username", username, { maxAge: 50000000, signed: true })
		.send({ message: "Cookie set" });
});

cookieRouter.get("/getSigned", (req, res) => {
	logger.info(req.signedCookies);
	res.send(req.signedCookies);
});

cookieRouter.get("/delete", (req, res) => {
	res.clearCookie(process.env.COOKIE_NAME).send("Cookie removed");
});

module.exports = cookieRouter;
