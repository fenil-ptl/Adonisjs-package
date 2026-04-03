import Stripe from "stripe";

export default class StripeService {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2026-03-25.dahlia",
    });
  }

  async createCheckoutSession({
    amount,
    currency,
    successUrl,
    cancelUrl,
  }: {
    amount: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Custom Product",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  constructEvent(payload: any, signature: string, webhookSecret: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
