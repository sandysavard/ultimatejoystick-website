"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  initializeCheckout,
  isAllowedStripePaymentLink,
  revealLocalPurchaseTest,
} = require("./stripe-checkout.js");

function makeButton(product, initialHref = "mailto:support@ultimatejoystick.com") {
  const attributes = new Map([["href", initialHref]]);
  const classes = new Set();
  const listeners = new Map();

  return {
    dataset: { stripeProduct: product },
    classList: {
      add(name) {
        classes.add(name);
      },
      remove(name) {
        classes.delete(name);
      },
      contains(name) {
        return classes.has(name);
      },
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    getAttribute(name) {
      return attributes.has(name) ? attributes.get(name) : null;
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    click() {
      let prevented = false;
      const listener = listeners.get("click");
      if (listener) {
        listener({
          preventDefault() {
            prevented = true;
          },
        });
      }
      return prevented;
    },
  };
}

function makeDocument(buttons, status) {
  return {
    querySelectorAll(selector) {
      assert.equal(selector, "[data-stripe-product]");
      return buttons;
    },
    getElementById(id) {
      assert.equal(id, "checkout-status");
      return status;
    },
  };
}

test("accepts only secure Stripe Payment Link URLs", () => {
  assert.equal(
    isAllowedStripePaymentLink("https://buy.stripe.com/test_123"),
    true
  );
  assert.equal(
    isAllowedStripePaymentLink("https://buy.stripe.com/aBcDeFg"),
    true
  );
  assert.equal(
    isAllowedStripePaymentLink("http://buy.stripe.com/test_123"),
    false
  );
  assert.equal(
    isAllowedStripePaymentLink("https://buy.stripe.com.evil.example/test_123"),
    false
  );
  assert.equal(isAllowedStripePaymentLink("https://example.com/pay"), false);
  assert.equal(isAllowedStripePaymentLink(""), false);
});

test("configured products navigate to their matching Stripe Payment Links", () => {
  const onePlayer = makeButton("onePlayer");
  const twoPlayer = makeButton("twoPlayer");
  const status = { hidden: true, textContent: "" };
  const documentObject = makeDocument([onePlayer, twoPlayer], status);

  initializeCheckout(documentObject, {
    paymentLinks: {
      onePlayer: "https://buy.stripe.com/test_one",
      twoPlayer: "https://buy.stripe.com/test_two",
    },
  });

  assert.equal(
    onePlayer.getAttribute("href"),
    "https://buy.stripe.com/test_one"
  );
  assert.equal(
    twoPlayer.getAttribute("href"),
    "https://buy.stripe.com/test_two"
  );
  assert.equal(onePlayer.getAttribute("aria-disabled"), null);
  assert.equal(twoPlayer.getAttribute("aria-disabled"), null);
  assert.equal(onePlayer.dataset.stripeReady, "true");
  assert.equal(twoPlayer.dataset.stripeReady, "true");
  assert.equal(onePlayer.click(), false);
  assert.equal(twoPlayer.click(), false);
  assert.equal(status.hidden, true);
});

test("unconfigured products stay blocked and explain how to order", () => {
  const onePlayer = makeButton("onePlayer");
  const status = { hidden: true, textContent: "" };
  const documentObject = makeDocument([onePlayer], status);

  initializeCheckout(documentObject, {
    paymentLinks: { onePlayer: "" },
  });

  assert.equal(onePlayer.getAttribute("aria-disabled"), "true");
  assert.equal(onePlayer.getAttribute("href"), "#checkout-status");
  assert.equal(onePlayer.dataset.stripeReady, "false");
  assert.equal(onePlayer.classList.contains("is-checkout-disabled"), true);
  assert.equal(onePlayer.click(), true);
  assert.equal(status.hidden, false);
  assert.match(status.textContent, /Stripe checkout is not active/i);
});

test("a deceptive configured URL is blocked instead of opened", () => {
  const onePlayer = makeButton("onePlayer");
  const status = { hidden: true, textContent: "" };
  const documentObject = makeDocument([onePlayer], status);

  initializeCheckout(documentObject, {
    paymentLinks: {
      onePlayer: "https://buy.stripe.com.evil.example/not-stripe",
    },
  });

  assert.equal(onePlayer.getAttribute("aria-disabled"), "true");
  assert.equal(onePlayer.click(), true);
  assert.equal(status.hidden, false);
});

test("fake purchase entry is visible locally and hidden on the live site", () => {
  const link = { hidden: true };
  const documentObject = {
    querySelector(selector) {
      assert.equal(selector, "[data-local-purchase-test]");
      return link;
    },
  };

  assert.equal(
    revealLocalPurchaseTest(documentObject, {
      protocol: "http:",
      hostname: "127.0.0.1",
    }),
    true
  );
  assert.equal(link.hidden, false);

  assert.equal(
    revealLocalPurchaseTest(documentObject, {
      protocol: "https:",
      hostname: "ultimatejoystick.com",
    }),
    false
  );
  assert.equal(link.hidden, true);
});

test("the shipped test configuration enables both product checkouts", () => {
  const priorWindow = global.window;
  global.window = {};
  const configPath = require.resolve("./stripe-config.js");
  delete require.cache[configPath];

  try {
    require(configPath);
    const config = global.window.ULTIMATE_JOYSTICK_STRIPE;

    assert.equal(config.mode, "test");
    assert.equal(
      isAllowedStripePaymentLink(config.paymentLinks.onePlayer),
      true
    );
    assert.equal(
      isAllowedStripePaymentLink(config.paymentLinks.twoPlayer),
      true
    );
  } finally {
    delete require.cache[configPath];
    if (priorWindow === undefined) {
      delete global.window;
    } else {
      global.window = priorWindow;
    }
  }
});
