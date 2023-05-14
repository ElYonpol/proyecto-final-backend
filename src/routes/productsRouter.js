const { Router } = require("express");
// const { io } = require("../config/server.js");
const {	productsCreationSchema,	productsUpdatingSchema, } = require("../validation/productsValidation.js");
const ProductController = require("../controllers/productsController.js");
const { objectsValidation } = require("../middleware/validator.js");
const { authPassport } = require("../passport-jwt/authPassport.js");
const { authorization } = require("../passport-jwt/authorizationPassport.js");

const productsRouter = Router();

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = new ProductController();

// GET http://localhost:8080/api/products
// productsRouter.get("/", authPassport("jwt"), authorization("admin"), getProducts);
productsRouter.get("/", getProducts);

// GET http://localhost:8080/api/products/:pid
productsRouter.get("/:pid", getProduct);

// POST http://localhost:8080/api/products
productsRouter.post("/",objectsValidation(productsCreationSchema),createProduct);

// PUT http://localhost:8080/api/products/:pid
productsRouter.put(	"/:pid",objectsValidation(productsUpdatingSchema),updateProduct);

// DELETE http://localhost:8080/api/products/:pid
productsRouter.delete("/:pid", deleteProduct);

module.exports = productsRouter;
