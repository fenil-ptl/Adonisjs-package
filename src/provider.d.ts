import { ApplicationService } from "@adonisjs/core/types";
import StripeService from "./stripe_service";

export default class StripeProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton("stripe", () => {
      const secretKey = process.env.STRIPE_SECRET_KEY!;
      return new StripeService(secretKey);
    });
  }
}
