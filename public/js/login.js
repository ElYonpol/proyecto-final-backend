console.log("Este es js de login.handlebars");

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const data = new FormData(loginForm);
	const obj = {};
	data.forEach((value, key) => {
		obj[key] = value;
	});

	await fetch("http://localhost:8080/api/sessions/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	})
		.then((response) => {
			if (response.status === 200 && response.redirected) {
				window.location.replace("/products");
			} else {
				console.log(response);
			}
		})
		.catch((error) => {
			return console.error(error);
		});
});
