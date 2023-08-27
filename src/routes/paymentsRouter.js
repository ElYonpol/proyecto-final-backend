const { Router } = require("express");
const { PaymentsService } = require("../service/paymentsService.js");

const paymentsRouter = Router();

paymentsRouter.post("/", async (req, res) => {
	try {
		const paymentIntentInfo = {
			amount: productRequested.price,
			currency: "ARS",
			metadata: {
				userId: "id.autogenerado-por-mongo",
				orderDetails: JSON.stringify(
					{
						[productRequested.name]: 2,
					},
					null,
					"\t"
				),
				address: JSON.stringify(
					{
						street: "Calle de prueba",
						postalCode: "3213",
						externalNumber: "123123",
					},
					null,
					"\t"
				),
			},
		};
		const service = new PaymentsService();
		let result = await service.createPaymentIntent(paymentIntentInfo);
		res.send({
			status: "success",
			payload: result,
		});
	} catch (error) {
		res.status(404).json({
			status: "error payment request",
			payload: { error: error, message: error.message },
		});
	}
});

module.exports = paymentsRouter;
