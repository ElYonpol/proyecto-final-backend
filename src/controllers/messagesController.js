const { messageService } = require("../service/service.js");

class MessageController {
	getMessages = async (req, res) => {
		try {
			const resp = await messageService.getItems();
			res.status(200).json({
				status: "success",
				payload: resp.docs,
			});
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	getMessageById = async (req, res) => {
		try {
			const mid = req.params.mid;
			const resp = await messageService.getItem(mid);
			if (!resp)
				return res
					.status(404)
					.json({ error: `El mensaje con el id ${mid} no fue encontrado.` });
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	createMessage = async (req, res) => {
		try {
			const newMessage = req.body;
			const resp = await messageService.createItem(newMessage);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	updateMessage = async (req, res) => {
		try {
			const mid = req.params.mid;
			const messageChanges = req.body;
			const resp = await messageService.updateItem(mid, messageChanges);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};

	deleteMessage = async (req, res) => {
		try {
			const mid = req.params.mid;
			const resp = await messageService.deleteItem(mid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	};
}

module.exports = MessageController;
