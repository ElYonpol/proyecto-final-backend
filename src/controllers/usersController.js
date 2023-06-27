const { userService } = require("../service/service.js");
const { SERVER_URL, PORT } = require("../config/setups.js");
const UserDto = require("../dto/userDto.js");
const CustomError = require("../utils/errors/CustomError.js");
const generateUserErrorInfo = require("../utils/errors/info.js");
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
				status: "error",
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
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	createUser = async (req, res) => {
		try {
			// // Prueba Clase 17 ----------------------------------------------------------------
			// const users = [];
			// let { first_name, last_name, email, edad } = req.body;
			// if (!first_name || !last_name || !email) {
			// 	CustomError.createError({
			// 		name: "User creation error",
			// 		cause: generateUserErrorInfo({ first_name, last_name, email }),
			// 		message: "Error trying to create user.",
			// 		code: EErrors.INVALID_TYPE_ERROR,
			// 	});
			// }

			// let userAgregado = users.push({ first_name, last_name });
			// logger.info(`Usuario ${first_name} ${last_name} agregado`);
			// logger.info("Array users es: ",users)
			// // Prueba Clase 17 ----------------------------------------------------------------

			const newUserRaw = req.body;
			const newUser = new UserDto(newUserRaw);
			const resp = await userService.createItem(newUser);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error trycatch",
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
				status: "error",
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
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};
}

module.exports = UserController;
