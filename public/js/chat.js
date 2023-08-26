const socket = io();

let user;
let chatBox = document.getElementById("chatBox");
let submitMessage = document.getElementById("submitMessage");
let messageLog = document.getElementById("messageLog");

Swal.fire({
	title: "Registro",
	input: "text",
	text: "Nombre de usuario requerido",
	inputValidator: (value) => {
		return !value && "Necesitas escribir un nombre de usuario";
	},
	allowOutsideClick: false,
}).then((resp) => {
	user = resp.value;
	socket.emit("authenticated", user);
});

socket.on("authenticated", (newUser) => {
	if (user) {
		Swal.fire({
			text: `Usuario ${newUser} conectado`,
			toast: true,
			position: "top-right",
		});
	}
});

const handleKeyUp = (evt) => {
	if (evt.key === "Enter") {
		if (chatBox.value.trim().length > 0) {
			socket.emit("chatMessage", { user: user, message: chatBox.value });
			chatBox.value = "";
		}
	}
};
chatBox.addEventListener("keyup", handleKeyUp);

const handleClick = (evt) => {
	if (chatBox.value.trim().length > 0) {
		socket.emit("chatMessage", { user: user, message: chatBox.value });
		chatBox.value = "";
	}
};
submitMessage.addEventListener("click", handleClick);

socket.on("messageLogs", (arrayServerMessage) => {
	let messages = "";
	arrayServerMessage.forEach((message) => {
		messages += `<li><strong>User:</strong> ${message.user} - <strong>says:</strong>  ${message.message}</li>`;
	});

	messageLog.innerHTML = "<ul>" + messages + "</ul>";
});

socket.on("newUser", (newUser) => {
	if (user) {
		Swal.fire({
			text: `Nuevo usuario ${newUser} conectado`,
			toast: true,
			position: "top-right",
		});
	}
});

socket.on("disconnect", (data) => {
	Swal.fire({
		text: `${data}`,
		toast: true,
		position: "top-right",
	});
});
