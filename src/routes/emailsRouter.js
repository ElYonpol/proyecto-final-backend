const { Router } = require("express");
const EmailController = require("../controllers/emailsController");

const emailsRouter = new Router();

const { getEmails, getEmailByID, sendTestEmail, deleteEmail } =
	new EmailController();

// GET http://localhost:8080/api/emails
emailsRouter.get("/", sendTestEmail);

module.exports = emailsRouter;
