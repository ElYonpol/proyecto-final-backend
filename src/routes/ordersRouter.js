const {Router} = require("express")

const ordersRouter = Router();

// GET http://localhost:8080/api/
ordersRouter.get("/", ()=>{})

ordersRouter.get("/:oid", ()=>{})

ordersRouter.post("/", ()=>{})

ordersRouter.put("/:oid", ()=>{})

ordersRouter.delete("/:oid", ()=>{})

module.exports = ordersRouter