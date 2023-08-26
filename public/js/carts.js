console.log("Este es js de carts.handlebars");

let buttons = document.querySelectorAll(".button-cart");

let cart = document.querySelector(".userCart");
let isCartEmpty = cart.id;

let userCartId = document.querySelector(".userCartId");
let cid = userCartId.id

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
		console.log("cid es: ",cid)
		let response = await fetch(`/api/carts/${cid}/purchase`, {
			method: "GET",
			headers: { "content-type": "application/json" },
		});

		let data = await response.json();

		if (data.status === "success") {
			let tid = data.payload.ticketCode
			let windowRedirectUrl = `/purchase/${tid}`;
			let windowRedirectMessage = "emisión de comprobante";

			Swal.fire({
				icon: "success",
				title: `¡Compra realizada!`,
				text: `Login exitoso, redirigiendo a ${windowRedirectMessage}`,
				showConfirmButton: false,
				timer: 2000,
				willClose: () => {
					// Redirige al usuario a la página de inicio si es ADMIN,
					// o a la página de productos si es USER o PREMIUM
					window.location.href = windowRedirectUrl;
				},
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "No se puede finalizar la compra, intente nuevamente",
				showConfirmButton: false,
				toast: true,
				position: "top-right",
				timer: 1500,
			});
		}
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
