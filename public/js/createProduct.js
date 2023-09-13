const url = window.location.href;
const urlObj = new URL(url);
const searchParameters = urlObj.searchParams;
const sort = document.getElementById("sort");
const category = document.getElementById("category");
const state = document.getElementById("status");
const buttons = document.querySelectorAll(".addToCart");
const submitForm = document.querySelector("#newProductForm");

submitForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const formData = new FormData(event.target);
	const data = Object.fromEntries(formData.entries());
	const dataCorrected = {
		code: data.newProductCode,
		category: data.newProductCategory,
		title: data.newProductTitle,
		description: data.newProductDescription,
		price: parseFloat(data.newProductPrice),
		stock: parseFloat(data.newProductStock),
		thumbnails: ["/static/assets/images/cartCard--nuevo.webp"],
	};
	if (dataCorrected) {
		fetch("/api/products", {
			method: "POST",
			body: JSON.stringify(dataCorrected),
			headers: { "content-type": "application/json" },
		})
			.then((response) => {
				if (response.status === 404) return response.json();
				if (!response.ok) throw new Error("Error HTTP: " + response.status);
				return response.json();
			})
			.then((data) => {
				if (data.status === "error") throw new Error(data.payload.message);
				console.log(JSON.stringify(data.payload));
				Swal.fire({
					text: `El producto ${data.payload.title} se creó correctamente`,
					icon: "success",
					title: "Creación exitosa",
				}).then((_) => window.location.replace("/products"));
			})
			.catch((error) =>
				Swal.fire({
					text: `No se pudo crear el producto. ${error.message}`,
					icon: "error",
					title: "Error",
				})
			);
	}
});
