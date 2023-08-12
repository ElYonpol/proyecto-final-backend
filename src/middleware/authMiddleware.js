const authRole = (roles) => {
	return async (req, res, next) => {
		if (!req.user)
			return res.status(401).json({ status: "error authRole", error: "Usuario no autorizado." });

		const isRoleAuthorized = roles.includes(req.user[0].role);
		
		if (!isRoleAuthorized)
			return res.status(403).json({ status: "error authRole", error: "Usuario sin permisos suficientes para acceder." });
		next();
	};
};

module.exports = { authRole };
