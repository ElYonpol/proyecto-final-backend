console.log("Este es js de carts.handlebars");

let buttons = document.querySelectorAll(".button-cart");

let cart = document.querySelector(".userCart");
let isCartEmpty = cart.id;

if (isCartEmpty === true) {
	Swal.fire({
		icon: "info",
		title: "Carrito vacío",
		text: "Tu carrito por ahora está vacío",
		toast: true,
		showConfirmButton: false,
		timer: 2000,
	});
}

const goShopping = (buttonId) => {
	Swal.fire({
		icon: "success",
		title: "Redirigiendo...",
		text: "Redirigiendo a productos",
		showConfirmButton: false,
		timer: 2000,
		willClose: () => {
			// Redirige al usuario a la página de productos
			window.location.href = "/products";
		},
	});
};

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		goShopping(button.id);
	});
});
