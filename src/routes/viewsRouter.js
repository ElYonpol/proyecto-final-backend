const { Router } = require("express");
const { productMgr } = require("../dao/productManagerMongo.js");
const productsRouter = require("./productsRouter.js");
const cartsRouter = require("./cartsRouter.js");
const { uploader } = require("../utils/uploader.js");

const router = Router();

router.use("/api/products/", productsRouter);
router.use("/api/cart/", cartsRouter);

router.post("/upload", uploader.single("myFile"), (req, res) => {
	res.send("Archivo subido correctamente");
});

router.get("/", (req, res) => {
	res.render("index", { style: "index.css" });
});

router.get("/realtimeproducts", async (req, res) => {
	const productList = await productMgr.getProducts();
	res.render("realTimeProducts", { style: "index.css", productList });
});

router.get("/chat", async (req, res) => {
	const chatLog = [];
	res.render("chat", { style: "index.css", chatLog });
});

//Prueba de listar productos con texto plano
router.get("/home", async (req, res) => {
	const productList = await productMgr.getProducts();
	res.render("home", { style: "index.css", productList });
});

//Prueba de listar productos con tabla con formato
router.get("/homeTable", async (req, res) => {
	const productList = await productMgr.getProducts();
	res.render("homeTable", { style: "index.css", productList });
});


module.exports = router;
