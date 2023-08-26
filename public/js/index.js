const userCart = document.querySelector(".userCart");
userCart.style.display = "none";

const showCartIcon = async () => {
	try {
		let response = await fetch("/api/sessions/current", {
			method: "GET",
			headers: { "content-type": "application/json" },
		});

		let data = await response.json();
		console.log("data es:", data);

		if (data.status === "success") {
			let cid = data.payload.cart;
			userCart.href = `/carts/${cid}`;
			userCart.style.display = "";
			console.log("userCart.href es:", userCart.href);
		}
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Ocurrió un error",
			text: `El error es: ${error} ${error.message}`,
		});
	}
};

showCartIcon()
