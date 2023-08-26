const { Router } = require("express");
const { userService } = require("../service/service.js");
const { userMgr } = require("../dao/mongo/managers/usersManagerMongo.js");
const { createHash } = require("../utils/bcryptPass.js");
const passport = require("passport");
const {
	usersLoginSchema,
	usersRegisterSchema,
} = require("../validation/sessionsValidation.js");
const { objectsValidation } = require("../middleware/validator.js");
const { logger } = require("../utils/logger.js");

const sessionsRouter = Router();

// GET http://localhost:8080/api/sessions/login
sessionsRouter.get("/login", (req, res) => {
	res.render("login");
});

// POST http://localhost:8080/api/sessions/login
sessionsRouter.post(
	"/login",
	objectsValidation(usersLoginSchema),
	passport.authenticate("login", {
		failureRedirect: "/api/sessions/faillogin",
	}),
	async (req, res) => {
		try {
			const sessionCookie = req.session.cookie;
			const sessionUserId = req.session.passport.user;
			logger.info(`Usuario ${req.user.first_name} ha iniciado sesión.`);

			// Traigo la información del usuario logueado
			let { first_name, last_name, role, email, cart } = req.user;

			const userInfo = {
				full_name: first_name + " " + last_name,
				first_name,
				last_name,
				role,
				email,
				cart,
				cid: req.user.cart._id.toString(),
			};

			const presentDate = Date.now();
			const uid = req.user._id;
			const userToUpdate = { last_connection: presentDate };
			await userMgr.update(uid, userToUpdate);

			res.json({ success: true, userInfo });
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

// GET http://localhost:8080/api/sessions/current
sessionsRouter.get("/current", (req, res) => {
	try {
		console.log("req.session.user es:", req.session.user);
		const userLoggedIn = req.session.user ? true : false;
		console.log("userLoggedIn:", userLoggedIn);

		if (!userLoggedIn) {
			res.status(404).json({
				status: "No hay usuario logueado",
				payload: { error: error, message: error.message },
			});
		} else {
			res.status(200).json({ status: "success", payload: req.session.user });
		}
	} catch (error) {
		res.status(404).json({
			status: "error session current",
			payload: {
				error: error,
				message: error.message,
			},
		});
	}
});

// GET http://localhost:8080/api/sessions/register
sessionsRouter.get("/register", (req, res) => {
	res.render("register");
});

// POST http://localhost:8080/api/sessions/register
sessionsRouter.post(
	"/register",
	objectsValidation(usersRegisterSchema),
	passport.authenticate("register", {
		successRedirect: "/login",
		failureRedirect: "/api/sessions/failregister",
	})
);

// GET http://localhost:8080/api/sessions/logout
sessionsRouter.get("/logout", (req, res) => {
	try {
		req.session.destroy((err) => {
			if (err) return res.send({ status: "Error en logout", message: err });
			res.json({ success: true, payload: "Usuario deslogueado correctamente" });
		});
	} catch (error) {
		res.status(404).json({
			status: "Error en logout",
			payload: {
				error: error,
				message: error.message,
			},
		});
	}
});

// GET http://localhost:8080/api/sessions/github
sessionsRouter.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get(
	"/githubcallback",
	passport.authenticate("github", {
		failureRedirect: "/api/sessions/failregister",
		session: false,
	}),
	(req, res) => {
		req.session.user = req.user;
		req.session.role = "user";
		res.redirect("/products");
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
	user.password = await createHash(password);
	await user.save();
	res.send({ status: "success", message: "Contraseña actualizada" });
});

module.exports = sessionsRouter;
