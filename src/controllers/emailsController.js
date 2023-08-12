const { emailService } = require("../service/service.js");
const sendMailTransport = require("../utils/nodemailer.js");

class EmailController {
	getEmails = async (req, res) => {
		try {
			const { page = 1, limit = 10, sort = null } = req.query;

			const query = req.query.query ? JSON.parse(req.query.query) : {};

			const specs = sort
				? { limit, page, sort: { first_name: sort }, lean: true }
				: { limit, page, lean: true };

			const resp = await emailService.getItems(query, specs);

			const currPage = resp.page;
			const prevPage = resp.prevPage;
			const nextPage = resp.nextPage;

			res.status(200).json({
				status: "success",
				payload: resp.docs,
				totalPages: resp.totalPages,
				prevPage: resp.prevPage,
				nextPage: resp.nextPage,
				page: currPage,
				hasPrevPage: resp.hasPrevPage,
				hasNextPage: resp.hasNextPage,
				prevLink: prevPage
					? `${SERVER_URL}:${PORT}/api/emails?limit=${limit}&page=${prevPage}`
					: null,
				nextLink: nextPage
					? `${SERVER_URL}:${PORT}/api/emails?limit=${limit}&page=${nextPage}`
					: null,
			});
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	getEmailByID = async (req, res) => {
		try {
			const eid = req.params.eid;
			const resp = await emailService.getItem(eid);
			if (!resp)
				return res
					.status(404)
					.json({ error: `El email con el id ${eid} no fue encontrado.` });
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
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

		// try {
		// 	const newEmail = req.body;
		// 	const resp = await emailService.createItem(newEmail);
		// 	res.status(200).json({ status: "success", payload: resp });
		// } catch (error) {
		// 	res.status(404).json({
		// 		status: "error",
		// 		payload: { error: error, message: error.message },
		// 	});
		// }
	};

	deleteEmail = async (req, res) => {
		try {
			const eid = req.params.eid;
			const resp = await emailService.deleteItem(eid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};
}

module.exports = EmailController;
