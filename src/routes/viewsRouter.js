const { Router } = require("express");
// const { productMgr } = require("../dao/productManagerMongo.js");
// const { cartMgr } = require("../dao/cartManagerMongo.js");
// const { userMgr } = require("../dao/userManagerMongo.js");
const { productService } = require("../service/index.js");
const { cartService } = require("../service/index.js");
const { userService } = require("../service/index.js");
const { uploader } = require("../utils/uploader.js");

const router = Router();

router.get("/", (req, res) => {
	res.render("index", { style: "index.css" });
});

//Prueba de listar productos con texto plano
router.get("/products", async (req, res) => {
	const { limit = 10, page = 1, sort = null } = req.query;
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	const spec = sort
		? { limit, page, sort: { price: sort }, lean: true }
		: { limit, page, lean: true };
	const { docs, ...rest } = await productService.getProducts(query, spec);
	const categories = await productService.getProductCategories();

	res.render("products", {
		style: "index.css",
		products: docs,
		paginate: rest,
		categories,
	});
});

//Prueba de listar productos con tabla con formato
router.get("/productsTable", async (req, res) => {
	const { limit = 10, page = 1, sort = null } = req.query;
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	const spec = sort
		? { limit, page, sort: { price: sort }, lean: true }
		: { limit, page, lean: true };
	const { docs, ...rest } = await productService.getProducts(query, spec);
	const categories = await productService.getProductsCategories();

	res.render("productsTable", {
		style: "index.css",
		products: docs,
		paginate: rest,
		categories,
	});
});

router.get("/api/carts/:cid", async (req, res) => {
	const cid = req.params.cid;
	const products = await cartService.getProductsByCartId(cid);
	res.render("carts", {
		style: "index.css",
		products: products,
	});
});

router.get("/carts", async (req, res) => {
	const carts = await cartService.getCarts();
	res.render("carts", {
		style: "index.css",
		carts: carts,
	});
});

router.post("/upload", uploader.single("myFile"), (req, res) => {
	res.send("Archivo subido correctamente");
});

router.get("/realtimeproducts", async (req, res) => {
	const { limit = 10, page = 1, sort = null } = req.query;
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	const spec = sort
		? { limit, page, sort: { price: sort }, lean: true }
		: { limit, page, lean: true };
	const { docs, ...rest } = await productService.getProducts(query, spec);

	res.render("realTimeProducts", {
		style: "index.css",
		products: docs,
		paginate: rest,
	});
});

router.get("/chat", async (req, res) => {
	res.render("chat", {});
});

router.get("/register", async (req, res) => {
	res.render("register", { style: "index.css" });
});

//Listar usuarios con formato tabla
router.get("/users", async (req, res) => {
	const { limit = 10, page = 1, sort = null } = req.query;
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	const spec = sort
		? { limit, page, sort: { first_name: sort }, lean: true }
		: { limit, page, lean: true };
	const { docs, ...rest } = await userService.getUsers(query, spec);
	const roles = await userService.getUserRoles();

	res.render("users", {
		style: "index.css",
		users: docs,
		paginate: rest,
		roles,
	});
});

module.exports = router;
