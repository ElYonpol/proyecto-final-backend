const { Router } = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const productsRouter = require("./productsRouter.js");
const cartsRouter = require("./cartsRouter.js");
const usersRouter = require("./usersRouter.js");
const viewsRouter = require("./viewsRouter.js");
const cookieRouter = require("./cookieRouter.js");
const sessionRouter = require("./sessionRouter.js");
const pruebasRouter = require("./pruebasRouter.js");
const { UserRouter } = require("./users.js");

const router = Router();

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/users", usersRouter)
router.use("/", viewsRouter);

const userRouter = new UserRouter();
router.use("/users", userRouter.getRouter());
router.use("/pruebas", pruebasRouter);

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
router.use("/session", sessionRouter); //Cuando use passport hay que eliminar esto
// _________________________________ cookies y session________________________

module.exports = router;
