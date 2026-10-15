"use strict";

(function createStripeCheckout(root, factory) {
  const checkout = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = checkout;
  }

  if (root) {
    root.StripeCheckout = checkout;
  }

  if (root && root.document) {
    root.document.addEventListener("DOMContentLoaded", function () {
      checkout.initializeCheckout(
        root.document,
        root.ULTIMATE_JOYSTICK_STRIPE || {}
      );
      checkout.revealLocalPurchaseTest(root.document, root.location);
    });
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  const NOT_READY_MESSAGE =
    "Stripe checkout is not active yet. Please check back soon.";

  function isAllowedStripePaymentLink(value) {
    if (typeof value !== "string" || value.trim() === "") {
      return false;
    }

    try {
      const checkoutUrl = new URL(value);
      return (
        checkoutUrl.protocol === "https:" &&
        checkoutUrl.hostname === "buy.stripe.com" &&
        checkoutUrl.pathname.length > 1
      );
    } catch (_error) {
      return false;
    }
  }

  function blockUnconfiguredButton(button, status) {
    button.dataset.stripeReady = "false";
    button.setAttribute("href", "#checkout-status");
    button.setAttribute("aria-disabled", "true");
    if (button.classList) {
      button.classList.add("is-checkout-disabled");
    }
    button.addEventListener("click", function (event) {
      event.preventDefault();
      if (status) {
        status.textContent = NOT_READY_MESSAGE;
        status.hidden = false;
      }
    });
  }

  function enableConfiguredButton(button, paymentLink) {
    button.setAttribute("href", paymentLink);
    button.removeAttribute("aria-disabled");
    if (button.classList) {
      button.classList.remove("is-checkout-disabled");
    }
    button.dataset.stripeReady = "true";
  }

  function initializeCheckout(documentObject, config) {
    const paymentLinks =
      config && typeof config.paymentLinks === "object"
        ? config.paymentLinks
        : {};
    const status = documentObject.getElementById("checkout-status");

    documentObject
      .querySelectorAll("[data-stripe-product]")
      .forEach(function (button) {
        const paymentLink = paymentLinks[button.dataset.stripeProduct];
        if (isAllowedStripePaymentLink(paymentLink)) {
          enableConfiguredButton(button, paymentLink);
        } else {
          blockUnconfiguredButton(button, status);
        }
      });
  }

  function configureCheckout(documentObject, paymentLinks) {
    initializeCheckout(documentObject, { paymentLinks: paymentLinks || {} });
  }

  function revealLocalPurchaseTest(documentObject, locationObject) {
    const link = documentObject.querySelector("[data-local-purchase-test]");
    if (!link || !locationObject) {
      return false;
    }

    const localHosts = new Set(["127.0.0.1", "localhost", "[::1]"]);
    const isLocal =
      locationObject.protocol === "file:" ||
      localHosts.has(locationObject.hostname);
    link.hidden = !isLocal;
    return isLocal;
  }

  return Object.freeze({
    configureCheckout,
    initializeCheckout,
    isStripePaymentLink: isAllowedStripePaymentLink,
    isAllowedStripePaymentLink,
    revealLocalPurchaseTest,
  });
});
