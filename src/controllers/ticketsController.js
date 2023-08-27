const { ticketService } = require("../service/service.js");

class TicketController {
	async getTickets(req, res) {
		try {
			const query = {};
			const specs = {};
			let tickets = await ticketService.getItems(query, specs);
			res.status(200).send({ status: "success", payload: tickets });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async getTicket(req, res) {
		try {
			const tid = req.params.tid;
			const ticket = await ticketService.getItem(tid);
			res.status(200).send({ status: "success", payload: ticket });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async createTicket(req, res) {
		try {
			const newTicket = req.body;
			const result = await ticketService.createItem(newTicket);
			res.status(200).send({ status: "success", payload: result });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async updateTicket(req, res) {
		try {
			const tid = req.params.tid;
			const ticketToUpdate = req.body;
			const resp = await ticketService.updateItem(tid, ticketToUpdate);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
	async deleteTicket(req, res) {
		try {
			const tid = req.params.tid;
			const resp = await ticketService.deleteItem(tid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}

	async getTicketByUserId(req, res) {
		try {
			const uid = req.user[0]._id;
			const resp = await ticketService.getTicketByUserId(uid);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}

	async getTicketByTicketCode(req, res) {
		try {
			const ticketCode = req.params.ticketCode
			const resp = await ticketService.getTicketByTicketCode(ticketCode);
			res.status(200).json({ status: "success", payload: resp });
		} catch (error) {
			res.status(404).json({
				status: "error",
				payload: { error: error, message: error.message },
			});
		}
	}
}

module.exports = { TicketController };
