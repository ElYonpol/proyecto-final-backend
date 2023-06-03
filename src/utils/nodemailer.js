const { createTransport } = require("nodemailer");
const { objConfig } = require("../config/config.js");
const { dirname } = require("path");

const transport = createTransport({
	service: "gmail",
	port: "587",
	auth: {
		user: objConfig.gmail_mail_user,
		pass: objConfig.gmail_pass,
	},
});

const sendMailTransport = async () => {
	await transport.sendMail({
		from: `Coder test <${objConfig.gmail_mail_user}>`,
		to: "jppe@yahoo.com.ar",
		subject: "Mail de Prueba",
		html: `
        <div>
            <h1>Mensaje de prueba</h1>
        </div>
        `,
		attachments: [
			{
				filename: "protesis.webp",
				path:
					dirname(dirname(__dirname)) +
					"/public/assets/images/logo_gmail.png",
				cid: "logo_gmail.png",
			},
		],
	});
};

module.exports = sendMailTransport;
