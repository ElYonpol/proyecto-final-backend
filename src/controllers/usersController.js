const { userService } = require("../service/service.js");
const { SERVER_URL, PORT } = require("../config/setups.js");
const UserDto = require("../dto/userDto.js");
const CustomError = require("../utils/errors/CustomError.js");
const {generateUserErrorInfo} = require("../utils/errors/info.js");
const EErrors = require("../utils/errors/EErrors.js");
const { logger } = require("../utils/logger.js");

class UserController {
	getUsers = async (req, res) => {
		try {
			const { page = 1, limit = 10, sort = null } = req.query;

			const query = req.query.query ? JSON.parse(req.query.query) : {};

			const specs = sort
				? { limit, page, sort: { first_name: sort }, lean: true }
				: { limit, page, lean: true };

			const resp = await userService.getItems(query, specs);

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
					? `${SERVER_URL}:${PORT}/api/users?limit=${limit}&page=${prevPage}`
					: null,
				nextLink: nextPage
					? `${SERVER_URL}:${PORT}/api/users?limit=${limit}&page=${nextPage}`
					: null,
			});
		} catch (error) {
			res.status(404).json({
				status: "error getUsers",
				payload: { error: error, message: error.message },
			});
		}
	};

	getUserByID = async (req, res) => {
		try {
			const uid = req.params.uid;
			const resp = await userService.getItem(uid);
			if (!resp)
				return res
					.status(404)
					.json({ error: `El usuario con el id ${uid} no fue encontrado.` });
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error getUserByID",
				payload: { error: error, message: error.message },
			});
		}
	};

	createUser = async (req, res) => {
		try {
			const newUserRaw = req.body;
			const newUser = new UserDto(newUserRaw);
			const resp = await userService.createItem(newUser);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error createUser",
				payload: { error: error, message: error.message },
			});
		}
	};

	updateUser = async (req, res) => {
		try {
			const uid = req.params.uid;
			const userToUpdate = req.body;
			const resp = await userService.updateItem(uid, userToUpdate);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error updateUser",
				payload: { error: error, message: error.message },
			});
		}
	};

	deleteUser = async (req, res) => {
		try {
			const uid = req.params.uid;
			const resp = await userService.deleteItem(uid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error deleteUser",
				payload: { error: error, message: error.message },
			});
		}
	};

	changeUserRoleByID = async (req, res) => {
		try {
			const uid = req.params.uid;
			const user = await userService.getItem(uid);
			console.log(user)
			logger.info(`User es ${user[0].first_name} ${user[0].last_name}`)

			if (user[0].role === "user") {
				const resp = await userService.updateItem(uid, { role: "premium" });
				res.status(200).json({ status: "success", payload: resp });
			} else if (user[0].role === "premium") {
				const resp = await userService.updateItem(uid, { role: "user" });
				res.status(200).json({ status: "success", payload: resp });
			}
		} catch (error) {
			res.status(404).json({
				status: "error changeUserRoleByID",
				payload: { error: error, message: error.message },
			});
		}
	};

	uploadFiles = async (req, res) => {
		try {
			// TODO: Completar esto
		} catch (error) {
			res.status(404).json({
				status: "error uploadFiles",
				payload: { error: error, message: error.message },
			});
		}
	}
}

module.exports = UserController;
