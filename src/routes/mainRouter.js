const { Router } = require("express");
const productsRouter = require("./productsRouter.js");
const cartsRouter = require("./cartsRouter.js");
const viewsRouter = require("./viewsRouter.js");

const router = Router();

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/", viewsRouter);

module.exports = router;