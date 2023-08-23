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
		.then((response) => response.json())
		.then((response) => {
			if (response.success) {
				Swal.fire({
					icon: "success",
					title: `¡Bienvenido ${response.username}! Login exitoso, redirigiendo a productos`,
					showConfirmButton: false,
					timer: 2000,
					willClose: () => {
						// Redirige al usuario a la página de productos
						window.location.href = "/products";
					},
				});
			} else {
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
				text: `Ocurrió un error al realizar el login: ${error} ${error.message}`,
			});
		});
});
