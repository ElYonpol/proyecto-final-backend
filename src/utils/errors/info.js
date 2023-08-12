const generateUserErrorInfo = (user) => {
	return `Una o más propiedades están incompletas, no es válido.
    Lista de propiedades requeridas:
    first_name : necesita ser string, y se recibió ${user.first_name}
    last_name  : necesita ser string, y se recibió ${user.last_name}
    email      : necesita ser string, y se recibió ${user.email}`;
};

const generateCartPurchasingErrorInfo = () => {
	return "El producto no se pudo agregar al carrito por falta de stock suficiente.";
};

const generateCartEmptyErrorInfo = () => {
	return "El carrito de compras está vacío o alguno de los productos elegidos son inválidos.";
};

module.exports = {
	generateUserErrorInfo,
	generateCartEmptyErrorInfo,
	generateCartPurchasingErrorInfo,
};
