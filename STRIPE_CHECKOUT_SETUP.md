# Ultimate Joystick Stripe Checkout Setup

The static order page is prepared for two Stripe-hosted Payment Links:

- `onePlayer`: Ultimate Joystick 1-Player System, one-time price of $100
- `twoPlayer`: Ultimate Joystick 2-Player System, one-time price of $200

Payment Links keep card entry on Stripe. The public website must never contain
a Stripe secret key, restricted key, or webhook signing secret.

## Current test-mode configuration

`stripe-config.js` currently contains two active Stripe sandbox Payment Links.
The Stripe account reports both as `livemode=false`. The 1-Player link contains
one $100 USD one-time item, and the 2-Player link contains one $200 USD one-time
item. Sandbox payments do not move real money and are not approval for public
sales.

## Verify test mode

1. Sign in to the business owner's Stripe Dashboard and use test mode.
2. Verify the customer email, billing details, shipping address, shipping
   rate, automatic tax behavior, receipt, refund policy, and business contact
   details that actually apply. Confirm whether the displayed package prices
   include shipping before activating the links.
3. Leave payment-method selection to Stripe. Do not add
   `payment_method_types` in browser code.
4. Keep only the public test Payment Links in `stripe-config.js`:

```js
window.ULTIMATE_JOYSTICK_STRIPE = Object.freeze({
  mode: "test",
  paymentLinks: Object.freeze({
    onePlayer: "https://buy.stripe.com/REPLACE_WITH_TEST_LINK",
    twoPlayer: "https://buy.stripe.com/REPLACE_WITH_TEST_LINK",
  }),
});
```

The controller accepts only HTTPS links hosted at exactly `buy.stripe.com`.
Blank, malformed, or deceptive links remain blocked.

## Test before live mode

Verify both products separately:

1. The correct product name, quantity, and price appear.
2. A successful Stripe test payment produces the expected receipt and owner
   notification.
3. Cancelling or closing checkout does not create a paid order.
4. Shipping and tax are calculated as intended.
5. The order appears in the Stripe Dashboard with the expected customer and
   delivery details.
6. Fulfillment cannot accidentally be performed twice for one Stripe payment.

The adjacent `Ultimate Joystick Purchase Test` program checks the website's
account and purchase experience with fake TEST currency. It never proves that a
real Stripe transaction works.

## Switch to live mode

After every test-mode check passes:

1. Complete the owner's Stripe account activation, bank, tax, privacy, shipping,
   refund, and contact settings.
2. Create or verify the matching live-mode products and Payment Links.
3. Replace the two test URLs with the two verified live
   `https://buy.stripe.com/...` URLs and set `mode` to `"live"`.
4. Open both live buttons and stop before payment to confirm the products and
   amounts. Make one controlled real order before public launch.

Do not call the website live-payment-ready while either Payment Link is blank.

If fulfillment later becomes automated, use server-created Stripe Checkout
Sessions plus a verified webhook. Keep all API keys on the server, verify the
webhook signature against the raw request body, and make fulfillment idempotent
using the Stripe event or Checkout Session ID.
