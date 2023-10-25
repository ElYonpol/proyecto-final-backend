const logoutForm = document.querySelector("#logoutForm");

const ServerDeploy = "https://proyecto-final-backend-production-18df.up.railway.app/"

logoutForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	await fetch(`${ServerDeploy}` + "api/sessions/login", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((response) => {
			if (response.success) {
				Swal.fire({
					icon: "success",
					title: "Logout exitoso",
					text: "Redirigiendo al inicio",
					showConfirmButton: false,
					timer: 2000,
					willClose: () => {
						// Redirige al usuario a la página de inicio
						window.location.href = "/";
					},
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Ocurrió un error al realizar el logout, por favor intente nuevamente",
					showConfirmButton: false,
					toast: true,
					position: "top-right",
					timer: 1500,
				});
			}
		})
		.catch((error) => {
			Swal.fire({
				icon: "error",
				title: "Ocurrió un error",
				text: `Ocurrió un error al realizar el logout: ${error} ${error.message}`,
			});
		});
});
