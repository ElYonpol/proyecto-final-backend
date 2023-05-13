const { Router } = require("express");
const cookieParser = require("cookie-parser");
// const session = require("express-session");
const productsRouter = require("./productsRouter.js");
const cartsRouter = require("./cartsRouter.js");
const usersRouter = require("./usersRouter.js");
const viewsRouter = require("./viewsRouter.js");
const cookieRouter = require("./cookieRouter.js");
const sessionRouter = require("./sessionRouter.js");


const router = Router();

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/users", usersRouter)
router.use("/", viewsRouter);

// _________________________________ cookies y session________________________
router.use("/api/sessions", sessionRouter);
router.use(cookieParser("CookieJPP3"));
router.use("/cookie", cookieRouter);
// _________________________________ cookies y session________________________

module.exports = router;
