const { Router } = require("express");
const {
	usersCreationSchema,
	usersUpdatingSchema,
} = require("../validation/usersValidation.js");
const UserController = require("../controllers/usersController.js");
const { usersValidation } = require("../middleware/validator.js");
const { authRole } = require("../middleware/authMiddleware.js");
const { authPassport } = require("../passport-jwt/authPassport.js");
const { authToken } = require("../utils/jsonwebtoken.js");

const usersRouter = Router();

const { getUsers, getUserByID, createUser, updateUser, deleteUser, changeUserRoleByID } =
	new UserController();

// GET http://localhost:8080/api/users
usersRouter.get("/", authToken, authRole("admin"), getUsers); // El user/pass debe ser jppe y el role admin
// usersRouter.get("/", getUsers); // Opción sin authToken ni authRole

// GET http://localhost:8080/api/users/:uid
usersRouter.get("/:uid", getUserByID);

// GET http://localhost:8080/api/users/premium/:uid //Desafío Complementario Clase 19 - PErmite cambiar el rol de un usuario, de “user” a “premium” y viceversa
usersRouter.get("/premium/:uid", changeUserRoleByID);

// POST http://localhost:8080/api/users/register
usersRouter.post("/register", usersValidation(usersCreationSchema), createUser);
// usersRouter.post("/register", createUser);

// PUT http://localhost:8080/api/users/:uid
usersRouter.put("/:uid", usersValidation(usersUpdatingSchema), updateUser);

// DELETE http://localhost:8080/api/users/:uid
usersRouter.delete("/:uid", deleteUser);

module.exports = usersRouter;
