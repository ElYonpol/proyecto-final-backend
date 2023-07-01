const { Router } = require("express");
const { userService } = require("../service/service.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const passport = require("passport");
const { generateToken, authToken } = require("../utils/jsonwebtoken.js");
const { authPassport } = require("../passport-jwt/authPassport.js");
const { authRole } = require("../middleware/authMiddleware.js");
const {
	usersLoginSchema,
	usersRegisterSchema,
} = require("../validation/sessionsValidation.js");
const { objectsValidation } = require("../middleware/validator.js");

const sessionsRouter = Router();

// GET http://localhost:8080/api/sessions/login
sessionsRouter.get("/login", (req, res) => {
	res.render("login");
});

// POST http://localhost:8080/api/sessions/login
sessionsRouter.post(
	"/login",
	objectsValidation(usersLoginSchema),
	async (req, res) => {
		try {
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

			res
				.cookie("cookieToken", accessToken, {
					maxAge: 60 * 60 * 1000 * 24,
					httpOnly: true,
				})
				.status(200)
				.send({
					status: "success",
					message: "Login successful",
					token: accessToken,
				});
			// .redirect("/products"); No funciona al mismo tiempo que send
		} catch (error) {
			res.status(404).json({
				status: "error trycatch sessions/login",
				payload: {
					error: error,
					message: error.message,
				},
			});
		}
	}
);

// GET http://localhost:8080/api/sessions/current
sessionsRouter.get("/current", authToken, (req, res) => {
	res.send({
		status: "success",
		payload: req.user,
	});
});

// GET http://localhost:8080/api/sessions/register
sessionsRouter.get("/register", (req, res) => {
	res.render("register");
});

// POST http://localhost:8080/api/sessions/register
sessionsRouter.post(
	"/register",
	objectsValidation(usersRegisterSchema),
	async (req, res) => {
		try {
			const {
				username,
				first_name,
				last_name,
				email,
				password,
				confirm_password,
				role = "user",
			} = req.body;

			errors = [];

			if (
				password.length === 0 ||
				confirm_password.length === 0 ||
				password !== confirm_password
			) {
				errors.push({ text: "Verifique las contraseñas ingresadas." });
			}

			const users = await userService.getByEmail(email);
			const userExist = users.find((user) => user.email === email);
			if (userExist) {
				errors.push({ text: "El usuario ya existe con ese mail" });
			}

			if (errors.length > 0) {
				return res.status(400).send({ status: "error", payload: errors });
			} else {
				const newUser = {
					username,
					first_name,
					last_name,
					email,
					password,
					role,
				};

				const resp = await userService.createItem(newUser); //No entiendo si con passport tengo que crea el usuario acá o en passportConfig.js

				const accessToken = generateToken(newUser);

				res.send({
					status: "success",
					message: "Usuario creado",
					accessToken,
				});
			}
		} catch (error) {
			res.status(404).json({
				status: "error trycatch register",
				payload: {
					error: error,
					message: error.message,
				},
			});
		}
	}
);

// GET http://localhost:8080/api/sessions/github
sessionsRouter.get("/github", passport.authenticate("github"));

sessionsRouter.get(
	"/githubcallback",
	passport.authenticate("github", {
		failureRedirect: "/api/sessions/failregister",
		session: false,
	}),
	(req, res) => {
		req.session.user = req.user;
		res.redirect("/api/products");
	}
);

// GET http://localhost:8080/api/sessions/failregister
sessionsRouter.get("/failregister", (req, res) => {
	res.send({ status: "error", message: "Error al crear el usuario" });
});

// GET http://localhost:8080/api/sessions/faillogin
sessionsRouter.get("/faillogin", (req, res) => {
	res.send({ status: "error", message: "Error al realizar el login" });
});

// PUT http://localhost:8080/api/sessions/recoverypass
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

// GET http://localhost:8080/api/sessions/logout
sessionsRouter.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.send({ status: "Logout error", message: err });
		res.send("Logout realizado con éxito.");
	});
});



module.exports = sessionsRouter;
