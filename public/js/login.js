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
				Swal.fire({
					text: "Login exitoso, redirigiendo a productos",
					toast: true,
					position: "top-right",
					icon: "success",
					showConfirmButton: false,
					timer: 1500,
				});
				window.location.replace("/products");
			} else {
				console.log(response);
				Swal.fire({
					text: "Por favor verifique el usuario y contraseña ingresados",
					toast: true,
					position: "top-right",
					icon: "error",
					showConfirmButton: false,
					timer: 1500,
				});
			}
		})
		.catch((error) => {
			Swal.fire({
				icon: "error",
				title: "Ocurrió un error",
				text: `Ocurrió un error: ${error} ${error.message}`,
			});
		});
});
