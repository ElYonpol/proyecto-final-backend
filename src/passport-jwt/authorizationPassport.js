// Función de passport para roles

const authorization = (role) => {
	return async (req, res, next) => {
		// redundancia
		if (!req.user)
			return res.status(401).send({ status: "error", error: "Unauthorized" });
		// pregunta por el role
		if (req.user.role === role)
			return res.status(403).send({ status: "eror", error: "No Permissions" });
		next();
	};
};

module.exports = { authorization };
