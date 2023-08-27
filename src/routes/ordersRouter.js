const { Router } = require("express");
const { OrderController } = require("../controllers/ordersController.js");

const ordersRouter = Router();
const orderController = new OrderController();

// GET http://localhost:8080/api/orders
ordersRouter.get("/", orderController.getOrders);

ordersRouter.get("/:oid", orderController.getOrder);

ordersRouter.post("/", orderController.createOrder);

ordersRouter.put("/:oid", orderController.updateOrder);

ordersRouter.delete("/:oid", orderController.deleteOrder);

module.exports = ordersRouter;
