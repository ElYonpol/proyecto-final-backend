const peticion = () => {
	let url = "http://localhost:8080/api/users";
	fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		// body: {
		// 	email: "pepe@gmail.com",
		// },
	}).then((resp) => {
		let respJson = resp.json();
		console.log("Respuesta: ", respJson);
	});
};
