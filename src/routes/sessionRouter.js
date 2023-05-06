const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
	res.render("login", {});
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;

	if (username !== "jppe" || password !== "jppe") {
		return res.status(401).send("Nombre de usuario o contraseña incorrectos.");
	}
	req.session.user = username;
	req.session.admin = true;

	res.send("Login exitoso");
});

router.get("/", (req, res) => {
	if (req.session.counter) {
		req.session.counter++;
		res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
	} else {
		req.session.counter = 1;
		res.send("Bienvenido");
	}
});

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.send({ status: "Logout error", message: err });
		res.send("Logout ok");
	});
});

module.exports = router;
