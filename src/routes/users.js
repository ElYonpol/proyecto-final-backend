const ClassRouter = require("./router.js");

class UserRouter extends ClassRouter {
	init() {
		this.get("/", (req, res) => {
			res.sendSuccess("Hola Coders");
		});
	}
}

module.exports = { UserRouter };
