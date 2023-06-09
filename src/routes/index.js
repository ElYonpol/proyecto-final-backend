const { Router } = require("express");
const cookieParser = require("cookie-parser");
const viewsRouter = require("./viewsRouter.js");
const productsRouter = require("./productsRouter.js");
const cartsRouter = require("./cartsRouter.js");
const usersRouter = require("./usersRouter.js");
const ordersRouter = require("./ordersRouter.js");
const sessionRouter = require("./sessionRouter.js");
const cookieRouter = require("./cookieRouter.js");
const emailsRouter = require("./emailsRouter.js");
const pruebasRouter = require("./pruebasRouter.js");
const mockingRouter = require("./mockingRouter.js");
const loggerRouter = require("./loggerRouter.js");
const errorHandler = require("../middleware/errors/indexError.js");
const { authRole } = require("../middleware/authMiddleware.js");

const router = Router();

router.use("/", viewsRouter);

router.use("/api/products", productsRouter);
router.use("/api/carts", authRole("user"), cartsRouter);
router.use("/api/users", usersRouter);
// router.use("/api/users", authRole("admin"), usersRouter);
router.use("/api/orders", ordersRouter);
router.use("/api/emails", emailsRouter);
router.use("/api/mockingproducts", mockingRouter);
router.use("/api/pruebas", pruebasRouter);
router.use("/api/loggerTest", loggerRouter);

// _________________________________ cookies y session________________________
router.use("/api/sessions", sessionRouter);
router.use(cookieParser(process.env.JWT_SECRET_KEY));
router.use("/cookie", cookieRouter);

// _________________________________ manejo de errores________________________
router.use(errorHandler);

module.exports = router;
