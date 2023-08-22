const { Router } = require("express");
const { userService } = require("../service/service.js");
const { userMgr } = require("../dao/mongo/managers/usersManagerMongo.js");
const { createHash, checkValidPassword } = require("../utils/bcryptPass.js");
const passport = require("passport");
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
	passport.authenticate("login", {
		failureRedirect: "/api/sessions/faillogin",
	}),
	async (req, res) => {
		try {
			console.log("User en sessionRouter es:", req.user);
			console.log("user.cart de sessionRouter es:", req.user.cart);
			console.log("user.email de sessionRouter es:", req.user.email);
			const sessionCookie = req.session.cookie;
			const sessionUserId = req.session.passport.user;

			const presentDate = Date.now();
			const uid = req.user._id;
			const userToUpdate = { last_connection: presentDate };
			await userMgr.update(uid, userToUpdate);
			res.redirect("/products");
		} catch (error) {
			console.log({ error });
		}
	}
);

// GET http://localhost:8080/api/sessions/current
sessionsRouter.get("/current", (req, res) => {
	try {
		res.status(200).json({ status: "success", payload: req.user });
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
			if (err) return res.send({ status: "Logout error", message: err });
			return res.status(307).redirect("/login");
		});
	} catch (error) {
		res.status(404).json({
			status: "error en logout",
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
