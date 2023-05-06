const { Router } = require("express");

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
				console.log(error);
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

	get(path, ...callbacks) {
		this.router.get(
			path,
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	post(path, ...callbacks) {
		this.router.get(
			path,
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	put(path, ...callbacks) {
		this.router.get(
			path,
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
	delete(path, ...callbacks) {
		this.router.get(
			path,
			this.generateCustomResponse,
			this.applyCallbacks(callbacks)
		);
	}
}

module.exports = ClassRouter;
