const { Router } = require("express");
const {	productsCreationSchema,	productsUpdatingSchema } = require("../validation/productsValidation.js");
const ProductController = require("../controllers/productsController.js");
const { objectsValidation } = require("../middleware/validator.js");
const { authRole } = require("../middleware/authMiddleware.js");
const { authPassport } = require("../passport-jwt/authPassport.js");

const productsRouter = Router();

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = new ProductController();

// GET http://localhost:8080/api/products
// productsRouter.get("/", authPassport("jwt"), getProducts);
productsRouter.get("/", getProducts);

// GET http://localhost:8080/api/products/:pid
productsRouter.get("/:pid", getProduct);

// POST http://localhost:8080/api/products
productsRouter.post("/", authRole("admin"), objectsValidation(productsCreationSchema),	createProduct);

// PUT http://localhost:8080/api/products/:pid
productsRouter.put("/:pid",	authRole("admin"), objectsValidation(productsUpdatingSchema), updateProduct);

// DELETE http://localhost:8080/api/products/:pid
productsRouter.delete("/:pid", authRole("admin"), deleteProduct);

module.exports = productsRouter;
