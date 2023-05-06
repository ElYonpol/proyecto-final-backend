const { Router } = require("express");
const { userMgr } = require("../dao/userManagerMongo.js");
const { authSession } = require("../middleware/auth.middleware");
const {
	usersCreationSchema,
	usersUpdatingSchema,
} = require("../validation/usersValidation.js");
const { objectsValidation } = require("../middleware/validator.js");
const { SERVER_URL, PORT } = require("../config/setups.js");

const usersRouter = Router();

// get http://localhost:8080/api/users
usersRouter.get("/", authSession, async (req, res) => {
	try {
		const { page = 1, limit = 10, sort = null } = req.query;
		const query = req.query.query ? JSON.parse(req.query.query) : {};
		const specs = sort
			? { limit, page, sort: { first_name: sort }, lean: true }
			: { limit, page, lean: true };
		const resp = await productMgr.getUsers(query, specs);
		const currPage = resp.page;
		const prevPage = resp.prevPage;
		const nextPage = resp.nextPage;

		res.status(200).json({
			status: "success",
			payload: resp.docs,
			totalPages: resp.totalPages,
			prevPage: resp.prevPage,
			nextPage: resp.nextPage,
			page: currPage,
			hasPrevPage: resp.hasPrevPage,
			hasNextPage: resp.hasNextPage,
			prevLink: prevPage
				? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${prevPage}`
				: null,
			nextLink: nextPage
				? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${nextPage}`
				: null,
		});
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

// get http://localhost:8080/api/users /id
usersRouter.get("/:uid", async (req, res) => {
	try {
		const uid = req.params.uid;
		const resp = await userMgr.getUserByID(uid);
		if (!resp)
			return res
				.status(404)
				.json({ error: `El usuario con el id ${uid} no fue encontrado.` });
		res.status(200).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

// POST http://localhost:8080/api/users /
usersRouter.post(
	"/",
	objectsValidation(usersCreationSchema),
	async (req, res) => {
		try {
			const newUser = req.body;
			const resp = await userMgr.addUser(newUser);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
);

// PUT http://localhost:8080/api/users /:userId
usersRouter.put(
	"/:uid",
	objectsValidation(usersUpdatingSchema),
	async (req, res) => {
		try {
			const uid = req.params.uid;
			const userToUpdate = req.body;
			const resp = await userMgr.updateUser(uid, userToUpdate);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
);

// DELETE http://localhost:8080/api/users /:userId
usersRouter.delete("/:uid", async (req, res) => {
	try {
		const uid = req.params.uid;
		const resp = await userMgr.deleteUser(uid);
		res.status(200).json({ status: "success", payload: resp });
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

module.exports = usersRouter;
