console.log("Este es js de products.handlebars");

let url = window.location.href;
let urlObj = new URL(url);
let searchParameters = urlObj.searchParams;
let sort = document.getElementById("sort");
let category = document.getElementById("category");
let state = document.getElementById("status");
let buttons = document.querySelectorAll(".addToCart");
let cart = document.querySelector(".userCart");
let cid = cart.id;

let nav = document.querySelector(".nav__list");
nav.innerHTML += `<li><a class="nav__link" href="/carts/${cid}">🛒</a></li>`;


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

const addToCart = async (pid) => {
	try {
		if (!cid) {
			let response = await fetch("/api/carts", {
				method: "POST",
				headers: { "content-type": "application/json" },
			});
			let data = await response.json();
			cid = data.payload._id;
		}

		let response = await fetch(`/api/carts/${cid}/products/${pid}`, {
			method: "POST",
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
		addToCart(button.id);
	});
});
