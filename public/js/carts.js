console.log("Este es js de carts.handlebars");

let cart = document.querySelector(".userCart");
let isCartEmpty = cart.id;

if (isCartEmpty) {
	Swal.fire({
		icon: "info",
		title: "Carrito vacío",
		text: "Tu carrito por ahora está vacío",
		toast: true,
		showConfirmButton: false,
		timer: 2000,
	});
}
