const userCart = document.querySelector(".userCart");
userCart.style.display = "none";

const showCartIcon = async () => {
	try {
		let response = await fetch("/api/sessions/current", {
			method: "GET",
			headers: { "content-type": "application/json" },
		});

		if (response.status === 404) {
			Swal.fire({
				icon: "info",
				title: "Tip",
				text: "Para ingresar selecciona la opción LOGIN del menú",
				toast: true,
				position: "top-right",
				showConfirmButton: false,
				timer: 1500,
			});
		} else {
			let data = await response.json();

			if (data.status === "success") {
				let cid = data.payload.cart;
				userCart.href = `/carts/${cid}`;
				userCart.style.display = "";
			}
		}
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Ocurrió un error",
			text: `El error es: ${error} ${error.message}`,
		});
	}
};

showCartIcon();
