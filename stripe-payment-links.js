"use strict";

/*
 * Compatibility name for the public Payment Link map.
 * stripe-config.js remains the single file to edit when links change.
 */
(function exposeStripePaymentLinks(root) {
  const config = root.ULTIMATE_JOYSTICK_STRIPE || { paymentLinks: {} };
  root.ULTIMATE_JOYSTICK_STRIPE_PAYMENT_LINKS = config.paymentLinks;

  if (typeof module === "object" && module.exports) {
    module.exports = config.paymentLinks;
  }
})(typeof window !== "undefined" ? window : globalThis);
