const { Router } = require("express");
const { logger } = require("../utils/logger");

class ClassRouter {
	constructor() {
		this.router = Router();
		this.init();
	}

	getRouter() {
		return this.router;
	}

	init() {} // clases hijas

	applyCallbacks(callbacks) {
		//params req,res
		return callbacks.map((callback) => async (...params) => {
			try {
				await callback.apply(this, params); // el método apply ejecuta la callback
			} catch (error) {
				logger.error(error);
				params[1].status(500).send(error); //p params[1] es res porque es [0,1,2] = (req,res,next)
			}
		});
	}

	generateCustomResponse(req, res, next) {
		res.sendSuccess = (payload) => res.send({ status: "success", payload });
		res.sendServerError = (error) => res.send({ status: "error", error });
		res.sendUserError = (error) => res.send({ status: "error", error });
		next();
	}

	handlePolicies = (policies) => (req, res, next) => {
		if (policies[0] === "PUBLIC") return next();
		const authHeader = req.headers.authorization;
		if (!authHeader)
			return res
				.status(401)
				.send({ status: "error", error: "Not Authenticated" });

		const token = authHeader.split(" ")[1];

		const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

		let user = jwt.verify(token, JWT_SECRET_KEY);
		if (!policies.includes(user.role.toUpperCase()))
			return res.status(403).send({ status: "error", error: "No permissions" });

		res.user = user;
		next();
	};

	get(path, policies, ...callbacks) {
		this.router.get(
			path,
			this.handlePolicies(policies),
			this.generateCustomResponse,
			["admin"],
			this.applyCallbacks(callbacks)
		);
	}
	post(path, policies, ...callbacks) {
		this.router.get(
			path,
			this.handlePolicies(policies),
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	put(path, policies, ...callbacks) {
		this.router.get(
			path,
			this.handlePolicies(policies),
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	delete(path, policies, ...callbacks) {
		this.router.get(
			path,
			this.handlePolicies(policies),
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
}

module.exports = ClassRouter;
