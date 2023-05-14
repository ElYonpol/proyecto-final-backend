console.log("Esta es js de chat.handlebars");

const socket = io();

let user;
const chatBox = document.getElementById("chatBox");
const submitMessage = document.getElementById("submitMessage");
let chatLog = document.getElementById("messageLogs");

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
			socket.emit("chatMessage", { user: user, userMessage: chatBox.value });
			chatBox.value = "";
		}
	}
};
chatBox.addEventListener("keyup", handleKeyUp);

const handleClick = (evt) => {
	if (chatBox.value.trim().length > 0) {
		socket.emit("chatMessage", { user: user, userMessage: chatBox.value });
		chatBox.value = "";
	}
};
submitMessage.addEventListener("click", handleClick);

socket.on("messageLogs", (arrayServerMessage) => {
	let messages = "";
	arrayServerMessage.forEach((message) => {
		messages += `<li>User: ${message.user} - says:  ${message.userMessage}</li>`;
	});

	chatLog.innerHTML = messages;
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
