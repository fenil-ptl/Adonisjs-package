"# Adonis Stripe Package

A comprehensive, production-ready Stripe integration package for AdonisJS 6, providing seamless payment processing, subscription management, and webhook handling.

AdonisJS 6 | TypeScript | Stripe API | Payment Processing | Subscriptions | Webhooks

## Overview

**adonis-stripe-package** is a robust, reusable Stripe integration library designed specifically for AdonisJS applications. It simplifies the implementation of complex payment workflows including:

- Customer and payment management
- Checkout sessions (payment and subscription modes)
- Subscription creation, upgrades, and cancellations
- Payment intents and one-time charges
- Refund processing
- Billing portal redirection
- Stripe webhook event handling with signature verification
- Invoice management and status tracking

This package provides a strongly-typed service layer that abstracts Stripe API complexity while exposing full control when needed.

## Key Highlights

- **AdonisJS Native Integration**: Built-in provider for seamless IoC container binding
- **Full TypeScript Support**: Comprehensive type definitions for all Stripe operations
- **Flexible Configuration**: Config-driven setup with environment variable fallback
- **Secure Webhook Handling**: Built-in webhook signature verification and event parsing
- **Subscription Workflows**: Complete lifecycle management for recurring billing
- **Payment Flexibility**: Support for one-time payments, payment intents, and refunds
- **Production Ready**: Comprehensive error handling and Stripe API best practices
- **Idempotency Support**: Built-in idempotent request handling for safe retries

## Tech Stack

| Layer | Technology |
|------|------|
| Language | TypeScript |
| Framework | AdonisJS 6 |
| Payment Provider | Stripe API |
| Type Safety | Native TypeScript Types |
| Build Tool | TypeScript Compiler (tsc) |
| Package Manager | npm / yarn |

## Features

### Customer Management
- Create Stripe customers with metadata
- Retrieve customer details
- Update customer information
- List and search customers

### Checkout Sessions
- Create payment checkout sessions
- Create subscription checkout sessions  
- Create upgrade checkout sessions
- List checkout sessions by customer
- Support for promotion codes and multiple payment methods
- Locale customization
- Metadata tracking

### Payments & Payment Intents
- Create payment intents with automatic payment methods
- Confirm and process payments
- Setup intents for future recurring charges
- Payment method management
- Webhook-based payment confirmation

### Subscriptions
- Create new subscriptions
- List and retrieve subscriptions
- Update subscription pricing or quantity
- Schedule subscription cancellations
- Handle subscription events (created, updated, deleted)
- Trial period support
- Metadata and custom attributes

### Refunds
- Process full and partial refunds
- Refund by payment intent or charge ID
- Custom refund reasons
- Metadata tracking for refunds

### Billing Portal
- Redirect customers to Stripe billing portal
- Customer self-service subscription management
- Invoice access and payment history

### Invoices
- Create invoices
- Retrieve and list customer invoices
- Get latest open/unpaid invoices
- Mark invoices as paid or sent
- Finalize draft invoices

### Webhook Handling
- Construct webhook events from raw request data
- Verify webhook signatures
- Parse and handle webhook events
- Custom event handlers (extensible)
- Support for multiple event types:
  - `customer.created`
  - `customer.updated`
  - `charge.completed`
  - `charge.failed`
  - `charge.refunded`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `invoice.created`
  - `invoice.finalized`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

## Project Structure

```
adonis-stripe-package/
├── src/
│   ├── index.ts              # Package entry point
│   ├── provider.ts           # AdonisJS service provider
│   ├── stripe_service.ts     # Main Stripe service class
│   ├── types.ts              # TypeScript interfaces and types
│   └── contracts/
│       └── stripe.d.ts       # Contract definitions
├── build/                    # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Stripe account with API keys
- An AdonisJS 6 project

### Installation

#### 1. Install the Package

```bash
npm install adonis-stripe-package
```

or

```bash
yarn add adonis-stripe-package
```

#### 2. Create Stripe Configuration File

Create `config/stripe.ts` in your AdonisJS project:

```typescript
import env from '#start/env'

const stripeConfig = {
  secretKey: env.get('STRIPE_SECRET_KEY'),
  config: {
    // Optional: Additional Stripe client configuration
  },
}

export default stripeConfig
```

#### 3. Register the Provider

Update `adonisrc.ts` (or `adonisrc.json`):

```typescript
export default defineConfig({
  providers: [
    () => import('adonis-stripe-package/provider'),
    // ... other providers
  ],
})
```

#### 4. Add Environment Variables

Update `.env` (or `.env.example`):

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret_here
STRIPE_API_VERSION=2026-03-25.dahlia
```

Get these values from your [Stripe Dashboard](https://dashboard.stripe.com):
- **Secret Key**: Settings → API Keys → Secret Key (development or production)
- **Webhook Secret**: Webhooks → Endpoint Details → Signing Secret

## Setup On A New Machine

Follow these steps when setting up the adonis-stripe-package on a fresh development environment.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd adonis-stripe-package
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Package

Compile TypeScript to JavaScript:

```bash
npm run build
```

For development with watch mode:

```bash
npm run dev
```

### 4. Prepare Environment

If integrating into an AdonisJS project:

- Ensure `.env` includes `STRIPE_SECRET_KEY`
- Stripe keys must be valid for the Stripe account you're testing with

## Installation in Existing Project

If you already have this package in your project:

1. Navigate to your AdonisJS project:

```bash
cd your-adonisjs-project
```

2. Reinstall dependencies:

```bash
npm install
```

3. Verify configuration:

```bash
# Check that config/stripe.ts exists and is properly configured
cat config/stripe.ts
```

4. Start your application:

```bash
npm run dev
```

The package will be available via the AdonisJS container as `stripe`.

## Environment Variables

Required configuration (in `.env`):

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_API_VERSION=2026-03-25.dahlia

# Optional: Add to your AdonisJS app .env for webhook handling
WEBHOOK_ENDPOINT=http://localhost:3333/webhook
```

## Usage

### Basic Setup in Controllers

Import and use the Stripe service in your AdonisJS controllers:

```typescript
import { inject } from '@adonisjs/core'
import type { StripeService } from 'adonis-stripe-package'

@inject()
export default class PaymentsController {
  constructor(private stripe: StripeService) {}

  // ... controller methods
}
```

### Creating a Customer

```typescript
const customer = await this.stripe.createCustomer({
  email: 'user@example.com',
  name: 'John Doe',
  metadata: {
    userId: '123',
    plan: 'premium',
  },
})

console.log(customer.id) // cus_xxx
```

### Creating a Checkout Session for Payment

```typescript
const session = await this.stripe.createCheckoutSession({
  lineItems: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Premium Track',
        },
        unit_amount: 9999, // $99.99
      },
      quantity: 1,
    },
  ],
  successUrl: 'https://yourdomain.com/success',
  cancelUrl: 'https://yourdomain.com/cancel',
  mode: 'payment',
  customerEmail: 'user@example.com',
})

// Redirect to session.url
return response.redirect(session.url!)
```

### Creating a Subscription Checkout Session

```typescript
const session = await this.stripe.createSubscriptionCheckoutSession({
  priceId: 'price_monthly_plan',
  successUrl: 'https://yourdomain.com/billing/success',
  cancelUrl: 'https://yourdomain.com/billing/cancel',
  customerEmail: 'user@example.com',
  trialPeriodDays: 14,
  metadata: {
    userId: '123',
  },
})

return response.redirect(session.url!)
```

### Creating a Subscription Directly

```typescript
const subscription = await this.stripe.createSubscription({
  customerId: 'cus_xxx',
  items: [
    {
      price: 'price_monthly_plan',
    },
  ],
  trialPeriodDays: 14,
  metadata: {
    planName: 'Professional',
  },
})

console.log(subscription.id) // sub_xxx
```

### Upgrading a Subscription

```typescript
const session = await this.stripe.createUpgradeCheckoutSession({
  subscriptionId: 'sub_xxx',
  priceId: 'price_professional_annual',
  successUrl: 'https://yourdomain.com/billing/upgrade/success',
  cancelUrl: 'https://yourdomain.com/billing/upgrade/cancel',
})

return response.redirect(session.url!)
```

### Processing a Refund

```typescript
const refund = await this.stripe.createRefund({
  paymentIntentId: 'pi_xxx',
  amount: 5000, // $50.00 (partial refund)
  reason: 'requested_by_customer',
  metadata: {
    ticketId: '456',
  },
})

console.log(refund.id) // re_xxx
```

### Handling Webhooks

In your AdonisJS controller:

```typescript
import { inject } from '@adonisjs/core'
import type { StripeService } from 'adonis-stripe-package'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WebhooksController {
  constructor(private stripe: StripeService) {}

  async handle({ request, response }: HttpContext) {
    const signature = request.header('stripe-signature')!
    const body = request.raw()!

    try {
      const event = await this.stripe.constructWebhookEvent({
        body,
        signature,
        secret: process.env.STRIPE_WEBHOOK_SECRET!,
      })

      // Handle different event types
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object)
          break

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object)
          break

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaid(event.data.object)
          break

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return response.ok({ received: true })
    } catch (error) {
      return response.badRequest({ error: 'Invalid signature' })
    }
  }

  private async handleSubscriptionCreated(subscription: any) {
    // Update your database
    console.log('Subscription created:', subscription.id)
  }

  private async handleSubscriptionUpdated(subscription: any) {
    // Update your database
    console.log('Subscription updated:', subscription.id)
  }

  private async handleInvoicePaid(invoice: any) {
    // Log payment received
    console.log('Invoice paid:', invoice.id)
  }

  private async handleSubscriptionCanceled(subscription: any) {
    // Revoke access or downgrade user
    console.log('Subscription canceled:', subscription.id)
  }
}
```

### Retrieving Subscription Details

```typescript
const subscription = await this.stripe.retrieveSubscription({
  subscriptionId: 'sub_xxx',
})

console.log(subscription.status) // 'active', 'past_due', etc.
console.log(subscription.current_period_end)
```

### Listing Customer Invoices

```typescript
const invoices = await this.stripe.listCustomerInvoices({
  customerId: 'cus_xxx',
  limit: 10,
})

invoices.data.forEach((invoice) => {
  console.log(invoice.number, invoice.total, invoice.status)
})
```

### Redirecting to Billing Portal

```typescript
const session = await this.stripe.createBillingPortalSession({
  customerId: 'cus_xxx',
  returnUrl: 'https://yourdomain.com/account',
})

return response.redirect(session.url)
```

## Available Methods

The `StripeService` exposes the following methods:

### Customers
- `createCustomer(input: CreateCustomerInput)`
- `retrieveCustomer(customerId: string)`
- `updateCustomer(customerId: string, input: any)`
- `listCustomers(params?: any)`

### Checkout Sessions
- `createCheckoutSession(input: CreateCheckoutSessionInput)`
- `createCheckoutSessionForPrice(input: CreateCheckoutSessionForPriceInput)`
- `createSubscriptionCheckoutSession(input: CreateSubscriptionCheckoutSessionInput)`
- `createUpgradeCheckoutSession(input: CreateUpgradeCheckoutSessionInput)`
- `listCheckoutSessions(input: ListCheckoutSessionsInput)`
- `retrieveCheckoutSession(sessionId: string)`

### Payment Intents
- `createPaymentIntent(input: CreatePaymentIntentInput)`
- `retrievePaymentIntent(paymentIntentId: string)`
- `confirmPaymentIntent(paymentIntentId: string, options?: any)`

### Subscriptions
- `createSubscription(input: CreateSubscriptionInput)`
- `retrieveSubscription(input: RetrieveSubscriptionInput)`
- `listSubscriptions(params?: any)`
- `updateSubscription(subscriptionId: string, options: UpdateSubscriptionOptions)`
- `cancelSubscription(subscriptionId: string, options?: any)`

### Refunds
- `createRefund(input: CreateRefundInput)`
- `retrieveRefund(refundId: string)`
- `listRefunds(params?: any)`

### Invoices
- `createInvoice(input: CreateInvoiceInput)`
- `retrieveInvoice(invoiceId: string)`
- `listCustomerInvoices(input: ListCustomerInvoicesInput)`
- `finalizeInvoice(invoiceId: string)`
- `markInvoicePaid(invoiceId: string)`
- `getLatestOpenInvoice(input: GetLatestOpenInvoiceInput)`

### Billing Portal
- `createBillingPortalSession(input: CreateBillingPortalSessionInput)`

### Webhooks
- `constructWebhookEvent(input: ConstructWebhookEventInput)`
- `handleWebhookEvent(input: HandleWebhookEventInput)`

### Raw Access
- `get client()` - Access the raw Stripe client for custom operations

## Type Definitions

All input types are available from the package:

```typescript
import type {
  CreateCheckoutSessionInput,
  CreateCustomerInput,
  CreateSubscriptionInput,
  CreatePaymentIntentInput,
  CreateRefundInput,
  CreateBillingPortalSessionInput,
  ConstructWebhookEventInput,
  // ... and many more
} from 'adonis-stripe-package'
```

## Configuration Best Practices

### In `config/stripe.ts`:

```typescript
import env from '#start/env'

export default {
  secretKey: env.get('STRIPE_SECRET_KEY'),
  config: {
    // Optional: Override default API version
    apiVersion: env.get('STRIPE_API_VERSION', '2026-03-25.dahlia'),
    
    // Optional: Timeout for API requests (ms)
    timeout: 30000,
    
    // Optional: Enable/disable TLS verification in dev
    httpClient: undefined,
  },
}
```

### Webhook Endpoint Configuration

In your AdonisJS `start/routes.ts`:

```typescript
router.post('/webhook', 'WebhooksController@handle')
```

Configure the webhook URL in [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
- **Endpoint URL**: `https://yourdomain.com/webhook`
- **Events to Send**: Select all payment-related events
- **Copy the signing secret** to your `.env` as `STRIPE_WEBHOOK_SECRET`

## Available Scripts

| Script | Description |
|------|------|
| `npm run build` | Build TypeScript to JavaScript |
| `npm run dev` | Build with watch mode for development |

## Security Notes

- **Never commit secrets**: Keep `.env` and Stripe keys in `.gitignore`
- **Use environment variables**: All sensitive keys should come from environment, not hardcoded
- **Webhook verification**: Always verify webhook signatures using the provided helper
- **API key rotation**: Rotate Stripe API keys if they are ever exposed
- **HTTPS only**: Always use HTTPS in production for webhook endpoints
- **Rate limiting**: Implement rate limiting on your webhook endpoint to prevent abuse
- **Use versioned API**: The package defaults to Stripe API version `2026-03-25.dahlia`

## Troubleshooting

### "STRIPE_SECRET_KEY is missing" Error

**Solution**: Ensure your `.env` file contains `STRIPE_SECRET_KEY` or update `config/stripe.ts` to provide it.

### Webhook Signature Verification Failed

**Solution**: 
1. Verify the webhook signing secret matches exactly in `.env`
2. Ensure the request body is passed as raw bytes (not parsed JSON)
3. Check that `stripe listen` is using the correct endpoint

### Payment Intent Confirmation Failed

**Solution**: Verify that:
- The payment method is valid and belongs to the customer
- The amount is in the correct currency's smallest unit (cents for USD)
- 3D Secure or other additional verification isn't required

## Examples

See the [audio-track-project](https://github.com/your-username/audio-track-project) repository for a complete implementation example using this package.

Key files to reference:
- `app/controllers/payments_controller.ts` - Payment handling
- `app/controllers/subscriptions_controller.ts` - Subscription management
- `app/controllers/webhooks_controller.ts` - Webhook processing
- `config/stripe.ts` - Configuration

## Contributing

Contributions are welcome! Please ensure:
- TypeScript compiles without errors: `npm run build`
- Code follows the existing patterns
- Types are properly defined
- Examples are provided for new features

## License

ISC

## Author

**Fenil Patel**

---

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [AdonisJS Documentation](https://docs.adonisjs.com)
- [Stripe Testing](https://stripe.com/docs/testing) - Test card numbers and keys" 
