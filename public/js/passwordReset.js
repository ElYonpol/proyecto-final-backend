const passwordform = document.querySelector("#resetPasswordForm");
const newPassword = document.querySelector("#newPassword");
const repeatNewPassword = document.querySelector("#repeatNewPassword");
const url = new URL(window.location.href);
const uid = url.pathname.substring(16);
const token = url.searchParams.get("token");

passwordform.addEventListener("submit", (e) => {
	e.preventDefault();
	if (
		newPassword.trim().length > 0 &&
		newPassword.trim() === repeatNewPassword.trim()
	) {
		const data = new FormData(passwordform);
		const obj = {
			uid,
			token,
		};
		data.forEach((value, key) => (obj[key] = value));
		fetch("/api/passwords/reset", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(obj),
		})
			.then((response) => {
				if (response.status === 404) return response.json();
				if (!response.ok) throw new Error("Error HTTP: " + response.status);
				return response.json();
			})
			.then((data) => {
				if (data.status === "error") throw new Error(data.payload.message);
				Swal.fire({
					text: data.payload,
					icon: "success",
					title: "Password reseteado",
				}).then((_) => window.location.replace("/login"));
			})
			.catch((error) =>
				Swal.fire({
					text: error.message,
					icon: "error",
					title: "Error",
				})
			);
	} else {
		Swal.fire({
			text: "Los passwords no coinciden",
			icon: "error",
			title: "Error",
		});
	}
});
