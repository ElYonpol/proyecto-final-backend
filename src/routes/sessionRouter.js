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

// GET http://localhost:8080/sessions/login
sessionsRouter.get("/login", (req, res) => {
	res.render("login");
});

// POST http://localhost:8080/sessions/login
sessionsRouter.post(
	"/login",
	objectsValidation(usersLoginSchema),
	passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }),
	async (req, res) => {
		try {
			if (!req.user)
				return res.status(400).json({
					status: "error",
					payload: {
						error: "Credenciales inválidas",
						message: "Revisar usuario y/o contraseña",
					},
				});

			const accessToken = generateToken(req.user);

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
			// .redirect("/products"); No funciona
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: {
					error: error,
					message: error.message,
				},
			});
		}
	}
);

// GET http://localhost:8080/sessions/current
sessionsRouter.get(
	"/current",
	authPassport("jwt"),
	authRole("user"),
	(req, res) => {
		res.send({
			status: "success",
			payload: req.user,
		});
	}
);

// GET http://localhost:8080/sessions/register
sessionsRouter.get("/register", (req, res) => {
	res.render("register");
});

// POST http://localhost:8080/sessions/register
sessionsRouter.post(
	"/register",
	objectsValidation(usersRegisterSchema),
	passport.authenticate("register", {
		failureRedirect: "/api/sessions/failregister",
	}),
	async (req, res) => {
		return res.status(307).redirect("/login");
	}
);

// GET http://localhost:8080/sessions/github
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

// GET http://localhost:8080/sessions/failregister
sessionsRouter.get("/failregister", (req, res) => {
	res.send({ status: "error", message: "Error al crear el usuario" });
});

// GET http://localhost:8080/sessions/faillogin
sessionsRouter.get("/faillogin", (req, res) => {
	res.send({ status: "error", message: "Error al realizar el login" });
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
