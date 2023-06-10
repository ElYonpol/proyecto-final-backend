const { Router } = require("express");
const { userService } = require("../service/service.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const passport = require("passport");
const { generateToken, authToken } = require("../utils/jsonwebtoken.js");

const sessionsRouter = Router();

// GET http://localhost:8080/sessions
sessionsRouter.get("/", (req, res) => {
	res.render("login", {});
});

// POST http://localhost:8080/sessions/login
sessionsRouter.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const users = await userService.getByUsername(username);
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
		message: "Login successful",
		token: accessToken,
	});
});

// GET http://localhost:8080/sessions/current
sessionsRouter.get("/current", authToken, (req, res) => {
	res.send({
		status: "success",
		payload: req.user,
	});
});

// GET http://localhost:8080/sessions/register
sessionsRouter.get("/register", (req, res) => {
	res.render("register");
});

// POST http://localhost:8080/sessions/register
sessionsRouter.post("/register", async (req, res) => {
	const {
		username,
		first_name,
		last_name,
		email,
		password,
		role = "user",
	} = req.body;
	const users = await userService.getByEmail(email);
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

	const resp = await userService.createItem(newUser);

	const accessToken = generateToken(newUser);

	res.send({
		status: "success",
		message: "Usuario creado",
		accessToken,
	});
});

// GET http://localhost:8080/sessions/github
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

// GET http://localhost:8080/sessions/failregister
sessionsRouter.get("/failregister", (req, res) => {
	res.send({ status: "error", message: "Error al crear el usuario" });
});

// PUT http://localhost:8080/sessions/recoverypass
sessionsRouter.put("/recoverypass", async (req, res) => {
	const { email, password } = req.body;
	const user = await userService.getByEmail(email);
	if (!user)
		return res
			.status(401)
			.send({ status: "error", message: "El usuario no existe" });
	user.password = createHash(password);
	await user.save();
	res.send({ status: "success", message: "Contraseña actualizada" });
});

// GET http://localhost:8080/sessions/logout
sessionsRouter.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.send({ status: "Logout error", message: err });
		res.send("Logout realizado con éxito.");
	});
});

module.exports = sessionsRouter;
