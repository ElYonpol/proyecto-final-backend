const { Router } = require("express");
const {	usersCreationSchema, usersUpdatingSchema } = require("../validation/usersValidation.js");
const UserController = require("../controllers/usersController.js");
const { usersValidation } = require("../middleware/validator.js");
const { authRole } = require("../middleware/authMiddleware.js");
const { authToken } = require("../utils/jsonwebtoken.js");

const usersRouter = Router();

const { getUsers, getUserByID, createUser, updateUser, deleteUser, changeUserRoleByID, uploadFiles } = new UserController();

// GET http://localhost:8080/api/users
usersRouter.get("/", authRole(["admin"]), getUsers); // El email deber ser admin@admin.com y el pass admin
// usersRouter.get("/", authToken, authRole(["admin"]), getUsers); // El email deber ser admin@admin.com y el pass admin
// usersRouter.get("/", getUsers); // Opción sin authToken ni authRole

// GET http://localhost:8080/api/users/:uid
usersRouter.get("/:uid", authRole(["admin"]), getUserByID);

// GET http://localhost:8080/api/users/premium/:uid //Desafío Complementario Clase 19 - Permite cambiar el rol de un usuario, de “user” a “premium” y viceversa
usersRouter.get("/premium/:uid", authRole(["user","premium"]), changeUserRoleByID);

// POST http://localhost:8080/api/users/register
usersRouter.post("/register", authRole(["admin"]), usersValidation(usersCreationSchema), createUser);
// usersRouter.post("/register", createUser);

// POST http://localhost:8080/api/users/:uid/documents //Desafío Complementario Clase 23 - Permite subir uno o varios archivos
usersRouter.get("/:uid/documents", authRole(["user","premium"]), uploadFiles);

// PUT http://localhost:8080/api/users/:uid
usersRouter.put("/:uid", authRole(["admin"]), usersValidation(usersUpdatingSchema), updateUser);

// DELETE http://localhost:8080/api/users/:uid
usersRouter.delete("/:uid", authRole(["admin"]), deleteUser);

module.exports = usersRouter;
