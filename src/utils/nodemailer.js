const { createTransport } = require("nodemailer");
const { objConfig } = require("../config/config.js");
const { dirname } = require("node:path");

const transport = createTransport({
	service: "gmail",
	port: 587,
	auth: {
		user: objConfig.gmail_mail_user,
		pass: objConfig.gmail_app_password,
	},
});

// const sendMailTransport = async () => {
// 	await transport.sendMail({
// 		from: `Portas Esquivel & Asociados - Odontología <${objConfig.gmail_mail_user}>`,
// 		to: "jppe@yahoo.com.ar",
// 		subject: "Portas Esquivel & Asociados - Odontología de Excelencia",
		// html: `
        // <div>
        //     <h1>Mensaje de prueba</h1>
		// 	<p>Este es un mensaje de prueba enviado automáticamente...</p>
        // </div>
        // `,
		// attachments: [
		// 	{
		// 		filename: "icon_pe.jpg",
		// 		path:
		// 			dirname(dirname(__dirname)) +
		// 			"/public/assets/icons/icon_pe.jpg",
		// 		cid: "icon_pe.jpg",
		// 	},
		// ],
// 	});
// };

const sendMailTransport = async (configMail) => {
    transport.sendMail({
        from: `Portas Esquivel & Asociados - Odontología <${objConfig.gmail_mail_user}>`,
        ...configMail
    })
} 

module.exports = sendMailTransport;
