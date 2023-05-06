const { Router } = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const productsRouter = require("./productsRouter.js");
const cartsRouter = require("./cartsRouter.js");
const viewsRouter = require("./viewsRouter.js");
const cookieRouter = require("./cookieRouter.js");
const sessionRouter = require("./sessionRouter.js");
const pruebasRouter = require("./pruebasRouter.js");

const router = Router();

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/", viewsRouter);

// _________________________________ cookies y session________________________
router.use(cookieParser("CookieJPP3"));
router.use(
	session({
		secret: "secretJPPE",
		resave: true,
		saveUninitialized: true,
	})
);
router.use("/cookie", cookieRouter);
router.use("/session", sessionRouter);
router.use("/pruebas", pruebasRouter);
// _________________________________ cookies y session________________________


module.exports = router;
