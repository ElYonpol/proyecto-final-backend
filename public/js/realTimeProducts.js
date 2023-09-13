const socket = io();

// INICIO Segmento configuración js para html________________________________
const url = window.location.href;
const urlObj = new URL(url);
const searchParameters = urlObj.searchParams;
const sort = document.getElementById("sort");
const category = document.getElementById("category");
const state = document.getElementById("status");
const buttons = document.querySelectorAll(".addToCart");
let cart = document.getElementById("cid");
let cid = cart.innerText;
const submitForm = document.querySelector("#newProductForm");

// INICIO Subsegmento ordenamiento y filtros ________________________________
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
// FIN Subsegmento ordenamiento y filtros ___________________________________

const addToCart = async (pid) => {
	try {
		if (!cid) {
			socket.emit("newCart");
			socket.on("newCartCreated", (cid) => {
				Swal.fire({
					text: `Nuevo carrito creado (id: ${cid}).`,
					toast: true,
					position: "top-right",
					icon: "success",
					showConfirmButton: false,
					timer: 1000,
				});
				let nav = document.querySelector(".nav__list");
				nav.innerHTML += `<li><a class="nav__link" href="/carts/${cid}">🛒</a></li>`;
			});
		}

		socket.emit("addProductToCart", { cid, pid });
		socket.on("productAddedToCart", (cid, pid) => {
			Swal.fire({
				text: `Producto ${pid} agregado al carrito.`,
				toast: true,
				position: "top-right",
				icon: "success",
				showConfirmButton: false,
				timer: 1000,
			});
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
		thumbnails: ["/static/assets/images/cartCard--nuevo.webp"],
	};
	if (dataCorrected) {
		socket.emit("newProduct", dataCorrected);
		submitForm.reset();
	}
});

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		addToCart(button.id);
	});
});
// FIN Segmento configuración js para html___________________________________

// INICIO Segmento aviso socket nuevo producto agregado______________________
const cardsList = document.getElementById("cartCards--list");

socket.on("newProductAdded", (newProduct) => {
	Swal.fire({
		text: `Nuevo producto ${newProduct.title} creado.`,
		toast: true,
		position: "top-right",
		icon: "success",
		showConfirmButton: false,
		timer: 1000,
	});
	const createNewProductCard = (newProduct) => {
		const addToCartButton = document.createElement("button");
		addToCartButton.dataset["id"] = newProduct.id;
		addToCartButton.classList.add("addToCart");
		addToCartButton.innerText = "Añadir al 🛒";

		const newProductCardHTML = document.createElement("div");
		newProductCardHTML.classList.add("cartCard");
		newProductCardHTML.innerHTML = `
		<div class="cartCard-image">
			<img
				class="image"
				style="height: 350px;"
				src="${newProduct.thumbnails}"
				alt="Imagen del producto"
			/>
		</div>
		<div class="cartCard-content">
			<p class="cartCard-content__title">${newProduct.title}</p>
			<p class="cartCard-content__body">${newProduct.description}</p>
			<p class="cartCard-content__body">Precio: $${newProduct.price}</p>
			<p class="cartCard-content__body">Categoría: ${newProduct.category}</p>
			/* {{#if ${newProduct.status}}} */
				<p class="cartCard-content__body">Stock: ${newProduct.stock}</p>
			/* {{else}}
				<p class="cartCard-content__body">No disponible</p>
			{{/if}} */
		</div>
		`;
		newProductCardHTML.appendChild(addToCartButton);

		return newProductCardHTML;
	};
	cardsList.appendChild(createNewProductCard(newProduct));
});
// FIN Segmento aviso socket nuevo producto agregado_________________________
