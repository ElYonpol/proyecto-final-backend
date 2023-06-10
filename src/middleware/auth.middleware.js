const authSession = (req, res, next) => {
	// console.log(req.session.user)
	// console.log(req.session.admin)
	if (req.session?.user !== "jppe" && !req.session?.admin) {
		return res.status(401).send("Error de autenticación");
	}

	next();
};

const authRole = (role) => {
	return async (req, res, next) => {
		if (!req.user)
			return res.status(401).json({ status: "error", error: "Unauthorized" });
		if (!req.user.role !== role)
			return res.status(403).json({ status: "error", error: "No permissions" });
		next();
	};
};

module.exports = {
	authSession,
	authRole,
};

// Clase 12 aún no implementado
// const authRole = (role) => {
// 	return async (req, res, next) => {
// 		if (!req.user)
// 			return res.status(401).json({ status: "error", error: "Unauthorized" });
// 		if (!req.user.role !== role)
// 			return res.status(403).json({ status: "error", error: "No permissions" });
// 		next();
// 	};
// };

// module.exports = { authRole };
