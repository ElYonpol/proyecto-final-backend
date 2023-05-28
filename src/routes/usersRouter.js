const { Router } = require("express");
const { authSession } = require("../middleware/auth.middleware");
const {
	usersCreationSchema,
	usersUpdatingSchema,
} = require("../validation/usersValidation.js");
const UserController = require("../controllers/usersController.js");
const { usersValidation } = require("../middleware/validator.js");

const usersRouter = Router();

const { getUsers, getUserByID, addUser, updateUser, deleteUser } =
	new UserController();

// GET http://localhost:8080/api/users
// usersRouter.get("/", authSession, getUsers); // Por el authSession, el suer debe ser jppe y el role admin
usersRouter.get("/", getUsers); // Opción sin authSession

// GET http://localhost:8080/api/users/:uid
usersRouter.get("/:uid", getUserByID);

// POST http://localhost:8080/api/users/register
usersRouter.post("/register", usersValidation(usersCreationSchema), addUser);

// PUT http://localhost:8080/api/users/:uid
usersRouter.put("/:uid", usersValidation(usersUpdatingSchema), updateUser);

// DELETE http://localhost:8080/api/users/:uid
usersRouter.delete("/:uid", deleteUser);

module.exports = usersRouter;
