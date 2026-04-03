import type StripeService from "../stripe_service";

declare module "@adonisjs/core/types" {
  interface ContainerBindings {
    stripe: StripeService;
  }
}
export {};