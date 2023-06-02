console.log("Esta es js de realTimeProducts.handlebars");

const socket = io();

// INICIO Segmento configuración js para html____________________________
const url = window.location.href;
const urlObj = new URL(url);
const searchParameters = urlObj.searchParams;
const sort = document.getElementById("sort");
const category = document.getElementById("category");
const state = document.getElementById("status");
const buttons = document.querySelectorAll(".addToCart");
const cart = document.querySelector(".userCart");
let cid;

// INICIO Subsegmento ordenamiento y filtros ___________________________________________
const findIndex = (valueToFind, options) => {
	for (let i = 0; i < options.length; i++) {
		if (options[i].value === valueToFind) {
			return i;
		}
	}
};

if (searchParameters.has("sort")) {
	sort.selectedIndex = findIndex(searchParameters.get("sort"), sort.options);
}

if (searchParameters.has("query")) {
	queryObj = JSON.parse(searchParameters.get("query"));
	let valueStatus = queryObj.status ?? "none";
	state.selectedIndex = findIndex(valueStatus, state.options);
	let valueCategory = queryObj.category ?? "none";
	category.selectedIndex = findIndex(valueCategory, category.options);
}

const changeOptions = (select) => {
	let value = select.options[select.selectedIndex].value;
	if (searchParameters.has(select.name)) {
		if (value === "none") {
			if (select.name === "query") {
				queryObj = JSON.parse(searchParameters.get("query"));
				delete queryObj[select.id];
				if (Object.keys(queryObj).length > 0) {
					value = JSON.stringify(queryObj);
					searchParameters.set(select.name, value);
				} else {
					searchParameters.delete("query");
				}
			} else {
				searchParameters.delete(select.name);
			}
		} else {
			if (select.name === "query") {
				queryObj = JSON.parse(searchParameters.get("query"));
				queryObj = { ...queryObj, [select.id]: value };
				value = JSON.stringify(queryObj);
			}
			searchParameters.set(select.name, value);
		}
	} else {
		if (select.name === "query") {
			queryObj = JSON.parse(searchParameters.get("query"));
			queryObj = { ...queryObj, [select.id]: value };
			value = JSON.stringify(queryObj);
		}
		searchParameters.set(select.name, value);
	}
	if (searchParameters.toString().length > 0) {
		window.location.href =
			urlObj.origin + urlObj.pathname + "?" + searchParameters.toString();
	} else {
		window.location.href = urlObj.origin + urlObj.pathname;
	}
};

const changePage = (page) => {
	if (searchParameters.has("page")) searchParameters.delete("page");
	if (searchParameters.toString().length > 0) {
		window.location.href =
			urlObj.origin +
			urlObj.pathname +
			"?page=" +
			page +
			"&" +
			searchParameters.toString();
	} else {
		window.location.href = urlObj.origin + urlObj.pathname + "?page=" + page;
	}
};
// FIN Subsegmento ordenamiento y filtros ___________________________________________

// INICIO Subsegmento trabajo con formulario para nuevos productos ___________________________________________
const submitForm = document.querySelector("#newProductForm");

const createNewProductCard = (newProductToAdd) => {
	const addToCartButton = document.createElement("button");
	addToCartButton.dataset["id"] = newProductToAdd.id;
	addToCartButton.classList.add("addToCart");
	addToCartButton.innerText = "Añadir al 🛒";

	const newProductCardHTML = document.createElement("div");
	newProductCardHTML.classList.add("cartCard");
	newProductCardHTML.innerHTML = `
	<div class="cartCard-image">
		<img
			class="image"
			style="height: 350px;"
			src="${newProductToAdd.thumbnails}"
			alt="Imagen del producto"
		/>
	</div>
	<div class="cartCard-content">
		<p class="cartCard-content__title">${newProductToAdd.title}</p>
		<p class="cartCard-content__body">${newProductToAdd.description}</p>
		<p class="cartCard-content__body">Precio: $${newProductToAdd.price}</p>
		<p class="cartCard-content__body">Categoría: ${newProductToAdd.category}</p>
		{{#if status}}
			<p class="cartCard-content__body">Stock: ${newProductToAdd.stock}</p>
		{{else}}
			<p class="cartCard-content__body">No disponible</p>
		{{/if}}
	</div>
	`;
	newProductCardHTML.appendChild(addToCartButton);

	return newProductCardHTML;
};

const addToCart = async (pid) => {
	console.log("pid en try es:", pid);
	try {
		if (!cid) {
			let response = await fetch("/api/carts", {
				method: "POST",
				headers: { "content-type": "application/json" },
			});
			let data = await response.json();
			cid = data.payload._id;
			console.log("cid en if de try es:", cid);
			let nav = document.querySelector(".nav__list");
			nav.innerHTML += `<li><a class="nav__link" href="/carts/${cid}">🛒</a></li>`;
		}

		console.log("cid en try es:", cid);

		let response = await fetch(`/api/carts/${cid}/products/${pid}`, {
			method: "POST",
			headers: { "content-type": "application/json" },
		});

		console.log("Response es:", response);

		let data = await response.json();
		let statusResp = data.status;

		console.log("statusResp es:", statusResp);

		if (statusResp !== "success") {
			return Swal.fire({
				icon: "error",
				title: "Ocurrió un error",
				text: "No se pudo agregar el producto al carrito.",
			});
		}
		Swal.fire({
			text: "Producto agregado",
			toast: true,
			position: "top-right",
			icon: "success",
			showConfirmButton: false,
			timer: 1000,
		});
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Ocurrió un error",
			text: `Ocurrió un error: ${error} ${error.message}`,
		});
	}
};

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
		thumbnails: ["/static/assets/images/cartCard--nuevo.webp"]
	};
	console.log("dataCorrected es:", dataCorrected);
	//Acá está el error, la conexión debe ser por socket, con emit
	const res = await fetch("/api/products", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(dataCorrected),
	});
});

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		addToCart(button.id);
	});
});
// FIN Subsegmento trabajo con nuevos productos ___________________________________________

// FIN Segmento configuración js para html____________________________

// INICIO Segmento configuración socket _________________________________
const cardsList = document.getElementById("cartCards--list");

socket.on("newProductAdded", (newProduct) => {
	Swal.fire({
		text: `Nuevo producto ${newProduct.title} creado.`,
		toast: true,
		position: "top-right",
	});
	cardsList.appendChild(createNewProductCard(newProduct));
});

// FIN Segmento configuración socket _________________________________
