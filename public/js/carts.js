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

const finalizePurchase = async (buttonId) => {
	try {
		let response = await fetch(`/api/carts/${cid}/purchase`, {
			method: "GET",
			headers: { "content-type": "application/json" },
		});

		let data = await response.json();

		if (data.status !== "success") {
			return Swal.fire({
				icon: "error",
				title: "Ocurrió un error",
				text: "No se pudo agregar el producto al carrito.",
			});
		}

		Swal.fire({
			icon: "success",
			title: "¡Producto agregado!",
			text: "Producto agregado correctamente al carrito",
			toast: true,
			position: "top-right",
			showConfirmButton: false,
			timer: 1500,
		});
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Ocurrió un error",
			text: `El error es: ${error} ${error.message}`,
		});
	}
};

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		if (button.id === "finalizarCompra") {
			finalizePurchase(button.id);
		} else {
			goShopping(button.id);
		}
	});
});
