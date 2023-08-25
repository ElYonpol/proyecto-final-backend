const { Router } = require("express");
const {
	productService,
	orderService,
	cartService,
	userService,
} = require("../service/service.js");
const { uploader } = require("../utils/uploader.js");
const sendMailTransport = require("../utils/nodemailer.js");
const { TokensDaos } = require("../dao/factory.js");
const { authRole } = require("../middleware/authMiddleware.js");

const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
	res.render("index", { style: "index.css" });
});

//Listar productos con tabla con formato
viewsRouter.get("/products", authRole(["user", "premium"]), async (req, res) => {
	const { limit = 10, page = 1, sort = null } = req.query;
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	const specs = sort
		? { limit, page, sort: { price: sort }, lean: true }
		: { limit, page, lean: true };
	const { docs, ...rest } = await productService.getItems(query, specs);
	const categories = await productService.getProductCategories();

	// Traigo la información del usuario logueado
	let { first_name, last_name, role, email, cart } = req.user[0];

	const userInfo = {
		full_name: first_name + " " + last_name,
		role,
		email,
		cart,
	};

	res.render("products", {
		style: "index.css",
		products: docs,
		paginate: rest,
		categories,
		userInfo,
	});
});

//Listar productos con tabla con formato y socket
viewsRouter.get("/realtimeproducts", authRole(["premium", "admin"]), async (req, res) => {
	const { limit = 10, page = 1, sort = null } = req.query;
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	const specs = sort
		? { limit, page, sort: { price: sort }, lean: true }
		: { limit, page, lean: true };
	const { docs, ...rest } = await productService.getItems(query, specs);
	const categories = await productService.getProductCategories();

	res.render("realTimeProducts", {
		style: "index.css",
		products: docs,
		paginate: rest,
		categories,
	});
});

viewsRouter.get("/carts", authRole(["admin"]), async (req, res) => {
	const query = {};
	const specs = {};
	const carts = await cartService.getItems(query, specs);
	res.render("carts", {
		style: "index.css",
		carts: carts,
	});
});

viewsRouter.get("/carts/:cid", async (req, res) => {
	const cid = req.user[0].cart.toString();
	const productsInCart = await cartService.getProductsByCartId(cid);

	let isCartEmpty = false;
	if (productsInCart.length === 0) {
		isCartEmpty = true;
	}

	// Traigo la información del usuario logueado
	let { first_name, last_name, role, email, cart } = req.user[0];

	const userInfo = {
		full_name: first_name + " " + last_name,
		first_name,
		last_name,
		role,
		email,
		cart,
		isCartEmpty,
		cid,
	};

	res.render("carts", {
		style: "index.css",
		userInfo,
		products: productsInCart,
	});
});

viewsRouter.get("/carts/:cid/purchase", async (req, res) => {
	const cid = req.user[0].cart.toString();
	const productsInCart = await cartService.getProductsByCartId(cid);

	let isCartEmpty = false;
	if (productsInCart.length === 0) {
		isCartEmpty = true;
	}

	// Traigo la información del usuario logueado
	let { first_name, last_name, role, email, cart } = req.user[0];

	const userInfo = {
		full_name: first_name + " " + last_name,
		first_name,
		last_name,
		role,
		email,
		cart,
		isCartEmpty,
		cid,
	};

	res.render("carts", {
		style: "index.css",
		userInfo,
		products: productsInCart,
	});
});

viewsRouter.post("/upload", uploader.single("myFile"), (req, res) => {
	res.send("Archivo subido correctamente");
});

viewsRouter.get("/chat", async (req, res) => {
	res.render("chat", { style: "index.css" });
});

viewsRouter.get("/login", async (req, res) => {
	res.render("login", { style: "index.css" });
});

viewsRouter.get("/register", async (req, res) => {
	res.render("register", { style: "index.css" });
});

//Listar usuarios con formato tabla
viewsRouter.get("/users", authRole(["admin"]), async (req, res) => {
	const { limit = 10, page = 1, sort = null } = req.query;
	const query = req.query.query ? JSON.parse(req.query.query) : {};
	const specs = sort
		? { limit, page, sort: { first_name: sort }, lean: true }
		: { limit, page, lean: true };
	const { docs, ...rest } = await userService.getItems(query, specs);
	const roles = await userService.getUserRoles();

	res.render("users", {
		style: "index.css",
		users: docs,
		paginate: rest,
		roles,
	});
});

//Listar ordenes con formato tabla
viewsRouter.get("/orders", async (req, res) => {
	const query = {};
	const specs = {};
	const orders = await orderService.getItems(query, specs);
	res.render("orders", {
		style: "index.css",
		orders: orders,
	});
});

//Prueba envío de emails
viewsRouter.get("/emails", async (req, res) => {
	try {
		const emails = await sendMailTransport();
		res.render("emails", {
			style: "index.css",
			message: "El email ha sido enviado con éxito.",
		});
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

viewsRouter.get("/passwordForgotten", async (req, res) => {
	res.render("passwordForgotten", {
		style: "index.css",
	});
});

viewsRouter.get("/passwordReset/:uid", async (req, res) => {
	try {
		const userToken = req.query.token;
		const presentDate = new Date();
		const uid = req.params.uid;
		const tokensList = await TokensDaos.getByUserId(uid);
		if (!tokensList.length > 0) {
			throw new Error("No existe una token válida.");
		}
		for (let i = 0; i < tokensList.length; i++) {
			const { _id, token, expireDate } = tokensList[i];
			if (expireDate > presentDate && token === userToken) {
				return res.render("passwordReset", {
					style: "index.css",
				});
			}
			await TokensDaos.delete(_id);
		}
		throw new Error("No existe una token válida o la misma ha expirado.");
	} catch (error) {
		res.status(404).json({
			status: "error",
			payload: { error: error, message: error.message },
		});
	}
});

module.exports = viewsRouter;
