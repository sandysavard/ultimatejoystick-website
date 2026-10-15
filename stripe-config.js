"use strict";

/*
 * Public Stripe Payment Link configuration.
 *
 * Payment Links are public checkout URLs, so they may be stored here.
 * Never place a Stripe API key, webhook secret, or account password in this
 * file. Configure and verify test-mode links first, then replace them with the
 * owner's live-mode links when the website is approved for public sales.
 */
window.ULTIMATE_JOYSTICK_STRIPE = Object.freeze({
  mode: "test",
  paymentLinks: Object.freeze({
    onePlayer: "https://buy.stripe.com/test_7sYaEZcv4fz61WO5eQejK00",
    twoPlayer: "https://buy.stripe.com/test_eVqcN77aK1Ig8lcgXyejK01",
  }),
});
