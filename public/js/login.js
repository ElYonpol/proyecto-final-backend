console.log("Este es js de login.handlebars");

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const data = new FormData(loginForm);
	console.log("data es: ", data);
	const obj = {};
	data.forEach((value, key) => {
		obj[key] = value;
	});
	console.log("obj es: ", obj);

	fetch("http://localhost:8080/sessions/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj),
	})
		.then((response) => {
			return response.json();
		})
		.then((response) => {
			localStorage.setItem("token", response.token);
			console.log("token es: ", response.token);
		});
});
