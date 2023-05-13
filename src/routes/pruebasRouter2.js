const { Router } = require("express");
const { fork } = require("child_process");

const router = Router();

const operacionCompleja = (params) => {
	let result = 0;
	for (let i = 0; i < 5e9; i++) {
		result += 1;
	}
	return result;
};
router.get("/complejaBlock", (req, res) => {
	const result = operacionCompleja();
	res.send(`<center><h1>El resultado es ${result}</h1></center>`);
});

router.get("/complejaNoBlock", (req, res) => {
	const child = fork("./src/utils/operacionCompleja.js");
	child.send("Inicia el cálculo por favor");
	child.on("message", (result) => {
		res.send(`<center><h1>El resultado es ${result}</h1></center>`);
	});
});

module.exports = router;
