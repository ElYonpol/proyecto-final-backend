const { Router } = require("express");

const router = Router();

router.get("/set", (req, res) => {
	res
		.cookie("CookiePruebaJP", "Este es el valor de la cookie", {
			maxAge: 50000000,
		})
		.send("Cookie set");
});

router.get("/", (req, res) => {
	res.render("login", {});
});

router.get("/get", (req, res) => {
	res.send(req.cookies);
});
// con firma
router.post("/setSigned", (req, res) => {
	const { username, password } = req.body;
	console.log(username, password);

	res
		.cookie("username", username, { maxAge: 50000000, signed: true })
		.send({ message: "Cookie set" });
});

router.get("/getSigned", (req, res) => {
	console.log(req.signedCookies);
	res.send(req.signedCookies);
});

router.get("/delete", (req, res) => {
	res.clearCookie("CookiePruebaJP").send("Cookie removed");
});

module.exports = router;
