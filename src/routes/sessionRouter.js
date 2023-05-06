const { Router } = require("express");
const { userModel } = require("../dao/models/dbMongo/usersModelMongo.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const passport = require("passport");

const sessionsRouter = Router();

sessionsRouter.get("/", (req, res) => {
	res.render("login", {});
});

sessionsRouter.post("/login", (req, res) => {
	if (!req.user)
		return res.status(400).send({
			status: "error",
			message: "Nombre de usuario y/o contraseña incorrectos.",
		});

	req.session.user = {
		username: req.user.username,
		email: req.user.email,
		admin: true,
	};

	res.send({
		status: "success",
		payload: req.session.user,
		message: "login correcto",
	});
});

// GET Registro
sessionsRouter.get("/register", (req, res) => {
	res.render("register");
});

// POST Registro
sessionsRouter.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/session/failregister",
	}),
	async (req, res) => {
		res.send({
			status: "success",
			message: "Usuario creado",
		});
	}
);

sessionsRouter.get(
	"/github",
	passport.authenticate("github")
);

sessionsRouter.get(
	"/githubcallback",
	passport.authenticate("github", { failureRedirect: "/session/failregister" }),
	(req, res) => {
		req.session.user = req.user;
		res.redirect("/products");
	}
);

sessionsRouter.get("/failregister", (req, res) => {
	res.send({ status: "error", message: "Error al crear el usuario" });
});

sessionsRouter.put("/recoverypass", async (req, res) => {
	const { email, password } = req.body;
	const user = await userModel.findOne({ email });
	if (!user)
		return res
			.status(401)
			.send({ status: "error", message: "El usuario no existe" });
	user.password = createHash(password);
	await user.save();
	res.send({ status: "success", message: "Contraseña actualizada" });
});

//GET logout
sessionsRouter.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.send({ status: "Logout error", message: err });
		res.send("Logout realizado con éxito.");
	});
});

//Ejercicio cantidad de visitas al sitio
sessionsRouter.get("/", (req, res) => {
	if (req.session.counter) {
		req.session.counter++;
		res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
	} else {
		req.session.counter = 1;
		res.send("Bienvenido");
	}
});

module.exports = sessionsRouter;
