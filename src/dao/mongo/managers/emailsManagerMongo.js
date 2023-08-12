const { emailModel } = require("../models/emailsModelMongo.js");
const sendMailTransport = require("../../../utils/nodemailer.js");

class EmailDaoMongo {
	constructor() {
		this.emailModel = emailModel;
	}

	get = async (filter, specs) => {
		return await this.emailModel.paginate(filter, specs);
	};

	getById = async (eid) => {
		return await this.emailModel.find({ _id: eid }).lean();
	};

	create = async (email) => {
		try {
			return await this.emailModel.create(email);
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	update = async (eid, changes) => {
		return await this.emailModel.updateOne({ _id: eid }, changes);
	};

	delete = async (eid) => {
		return await this.emailModel.updateOne({ _id: eid }, { status: false });
	};

	getByReceiver = async (emailAddress) => {
		return await this.emailModel.find({ email_to: emailAddress }).lean();
	};

	sendTestEmail = async (req, res) => {
		try {
			const configMail = {
				to: "jppe@yahoo.com.ar",
				subject: "Portas Esquivel & Asociados - Odontología de Excelencia",
				html: `
					<div>
						<h1>Mensaje de prueba</h1>
						<p>Este es un mensaje de prueba enviado automáticamente...</p>
					</div>
					`,
				attachments: [
					{
						filename: "icon_pe.jpg",
						path:
							dirname(dirname(__dirname)) + "/public/assets/icons/icon_pe.jpg",
						cid: "icon_pe.jpg",
					},
				],
			};
			await sendMailTransport(configMail);
			res.status(200).json({
				status: "success",
				payload: { message: "El email ha sido enviado." },
			});
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};
}

const emailMgr = new EmailDaoMongo();

module.exports = { EmailDaoMongo, emailMgr };
