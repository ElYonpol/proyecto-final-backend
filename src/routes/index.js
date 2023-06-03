const { Router } = require("express");
const cookieParser = require("cookie-parser");
const viewsRouter = require("./viewsRouter.js");
const productsRouter = require("./productsRouter.js");
const cartsRouter = require("./cartsRouter.js");
const usersRouter = require("./usersRouter.js");
const ordersRouter = require("./ordersRouter.js");
const sessionRouter = require("./sessionRouter.js");
const cookieRouter = require("./cookieRouter.js");
const pruebasRouter = require("./pruebasRouter.js");

const router = Router();

router.use("/", viewsRouter);

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/users", usersRouter);
router.use("/api/orders", ordersRouter)
router.use("/pruebas", pruebasRouter)



// _________________________________ cookies y session________________________
router.use("/api/sessions", sessionRouter);
router.use(cookieParser("CookieJPP3"));
router.use("/cookie", cookieRouter);
// _________________________________ cookies y session________________________

module.exports = router;
