const { Router } = require("express");
const { userMgr } = require("../dao/userManagerMongo.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const passport = require("passport");
const { generateToken, authToken } = require("../utils/jsonwebtoken.js");

const sessionsRouter = Router();

sessionsRouter.get("/", (req, res) => {
	res.render("login", {});
});

sessionsRouter.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const users = await userMgr.getUserByUsername(username);
	const user = users.find(
		(user) => user.username === username && user.password === password
	);
	if (!user)
		return res
			.status(400)
			.send({ status: "error", message: "Revisar usuario y contraseña" });
	const accessToken = generateToken(user);
	res.send({
		status: "success",
		payload: accessToken,
	});
});

sessionsRouter.get("/current", authToken, (req, res) => {
	res.send({
		status: "success",
		payload: req.user,
	});
});

// GET Registro
sessionsRouter.get("/register", (req, res) => {
	res.render("register");
});

// POST Registro
sessionsRouter.post("/register", async (req, res) => {
	const {
		username,
		first_name,
		last_name,
		email,
		password,
		role = "user",
	} = req.body;
	const users = await userMgr.getUserByEmail(email);
	const userExist = users.find((user) => user.email === email);
	if (userExist)
		return res
			.status(400)
			.send({ status: "error", message: "El usuario ya existe" });
	const newUser = {
		username,
		first_name,
		last_name,
		email,
		password,
		role,
	};

	const resp = await userMgr.addUser(newUser);

	const accessToken = generateToken(newUser);

	res.send({
		status: "success",
		message: "Usuario creado",
		accessToken,
	});
});

sessionsRouter.get("/github", passport.authenticate("github"));

sessionsRouter.get(
	"/githubcallback",
	passport.authenticate("github", {
		failureRedirect: "/sessions/failregister",
		session: false,
	}),
	(req, res) => {
		req.session.user = req.user;
		res.redirect("/api/products");
	}
);

sessionsRouter.get("/failregister", (req, res) => {
	res.send({ status: "error", message: "Error al crear el usuario" });
});

sessionsRouter.put("/recoverypass", async (req, res) => {
	const { email, password } = req.body;
	const user = await userMgr.getUserByEmail(email);
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
