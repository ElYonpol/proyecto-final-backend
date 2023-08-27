const { Stripe } = require("stripe");
const { objConfig } = require("../config/config");

class PaymentsService {
	constructor() {
		this.stripe = new Stripe(objConfig.stripeSecretKey);
	}

	createPaymentIntent = async (data) => {
		const paymentIntent = this.stripe.paymentIntents.create(data);
		return paymentIntent;
	};
}

module.exports = { PaymentsService };
