const { Router } = require("express");
const {	usersCreationSchema, usersUpdatingSchema } = require("../validation/usersValidation.js");
const UserController = require("../controllers/usersController.js");
const { usersValidation } = require("../middleware/validator.js");
const { authSession, authRole } = require("../middleware/auth.middleware.js");
const { authPassport } = require("../passport-jwt/authPassport.js");
const { authorization } = require("../passport-jwt/authorizationPassport.js");
const { authToken } = require("../utils/jsonwebtoken.js");

const usersRouter = Router();

const { getUsers, getUserByID, addUser, updateUser, deleteUser } = new UserController();

// GET http://localhost:8080/api/users
usersRouter.get("/", authToken, getUsers); // El user/pass debe ser jppe y el role admin
// usersRouter.get("/", getUsers); // Opción sin authToken ni authRole

// GET http://localhost:8080/api/users/:uid
usersRouter.get("/:uid", getUserByID);

// POST http://localhost:8080/api/users/register
usersRouter.post("/register", usersValidation(usersCreationSchema), addUser);

// PUT http://localhost:8080/api/users/:uid
usersRouter.put("/:uid", usersValidation(usersUpdatingSchema), updateUser);

// DELETE http://localhost:8080/api/users/:uid
usersRouter.delete("/:uid", deleteUser);

module.exports = usersRouter;
