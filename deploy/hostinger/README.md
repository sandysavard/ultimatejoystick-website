# ultimatejoystick.com on Hostinger - owner checklist

Written for the site owner. Everything marked **YOU** needs a click or a paste in a website; everything else is already
done in the repository. Do the numbered steps in order. Nothing here costs money: the site runs on the Business web
hosting plan you already own (the same plan as contractorsclassroom.com).

What this site is: plain HTML/CSS/JS, no Node process, no database. Hostinger serves the files straight from
`public_html`. That is simpler than Contractors Classroom (which is a Node.js Web App), so there is no build step, no
environment variables and no entry file.

Files in the repository that matter for deployment:

| File | What it does |
| --- | --- |
| `.htaccess` | forces `https://ultimatejoystick.com` (no www), redirects the old `ultimate_joystick.html` twin to `/`, serves `404.html`, adds security headers, caching and compression, and blocks the `deploy/`, `tools/` and `marketing/` folders from being served |
| `404.html` | branded not-found page |
| `robots.txt`, `sitemap.xml` | already point at `https://ultimatejoystick.com` |
| `tools/qa-site.mjs` | the quality gate (`node tools/qa-site.mjs` locally, or `node tools/qa-site.mjs --url=https://ultimatejoystick.com` after go-live) |

Current state of the domain (checked 2026-10-14): `ultimatejoystick.com` has **no A record**. Its nameservers are
Cloudflare (`matias.ns.cloudflare.com`, `tina.ns.cloudflare.com`), so DNS is edited in the Cloudflare dashboard, not in
hPanel, unless you move the nameservers (step 5 explains both).

---

## 1. YOU: add the website in hPanel (5 minutes)

hPanel -> **Websites -> Add Website -> Empty website** (not WordPress, not Node.js Apps) -> when asked for a domain,
enter `ultimatejoystick.com` (choose "Use an existing domain"; if hPanel insists the domain is not pointed yet, pick the
free temporary `*.hostingersite.com` address instead and connect the real domain in step 5).

Result: a new website card with an empty `public_html`.

## 2. YOU: connect the GitHub repository (auto-deploy on every push)

The site lives in its own repository so Hostinger can pull it directly:
`https://github.com/sandysavard/ultimatejoystick-website` (private, branch `main`, the site files are at the root).

1. hPanel -> the new website -> **Manage -> Advanced -> Git**.
2. **Create a new repository**: Repository `git@github.com:sandysavard/ultimatejoystick-website.git`, Branch `main`,
   Directory: leave **empty** (= `public_html`). Click **Create**.
3. Because the repository is private, hPanel shows an **SSH key**. Copy it, then on GitHub:
   repository -> **Settings -> Deploy keys -> Add deploy key**, paste it, read-only is enough. Save.
4. Back in hPanel click **Deploy**. The file list should show `index.html`, `order.html`, `video_demo.html`,
   `styles.css`, `.htaccess`, `videos/`, ...
5. Turn on **Auto deployment**: hPanel shows a webhook URL. On GitHub: repository -> **Settings -> Webhooks -> Add
   webhook**, Payload URL = that URL, content type `application/json`, event "Just the push event". Save.
   From now on every push to `main` updates the live site within a minute.

If you would rather not use Git: hPanel -> **File Manager** -> `public_html` -> upload the contents of the `Website`
folder (including the hidden `.htaccess`). Repeat the upload after every change.

## 3. First test on the temporary address (if you used one)

Open `https://<temporary-domain>/`, `/order.html`, `/video_demo.html`, `/does-not-exist` (must show the branded 404).
Play one video. On a phone too. Then run from your PC:

```
node tools/qa-site.mjs --url=https://<temporary-domain>
```

Every line must say `ok`. (The https redirect check is skipped for temporary domains.)

## 4. YOU: Stripe - do this BEFORE the real domain goes live

`stripe-config.js` still holds **test-mode** Payment Links (`mode: "test"`). The order buttons are enabled whenever a
`buy.stripe.com` link is present, so with the test links a visitor would reach a Stripe **test** checkout and could
"buy" with a test card. Before step 5 either:

* paste the two **live** Payment Links (Stripe Dashboard -> Payment Links, live mode) into `stripe-config.js`, set
  `mode: "live"`, commit and push; or
* blank both links (`onePlayer: ""`, `twoPlayer: ""`): the buttons then show "Stripe checkout is not active yet" and
  orders fall back to e-mail.

`STRIPE_CHECKOUT_SETUP.md` has the full test-then-live procedure. Also create the mailbox the site advertises:
hPanel -> **Emails** -> `support@ultimatejoystick.com` (every "Contact" and "Order" fallback link on the site uses it).

## 5. YOU: point ultimatejoystick.com at Hostinger (the switch)

Find Hostinger's values first: hPanel -> the website -> **Manage -> DNS / Nameservers** (or Hosting -> Details). Write
down the **A record IP** for the plan and Hostinger's nameservers (`ns1.dns-parking.com`, `ns2.dns-parking.com`).

**Option A - keep DNS at Cloudflare (recommended, nothing else changes):**
1. dash.cloudflare.com -> `ultimatejoystick.com` -> **DNS -> Records**:
   * `A`    name `@`   content `<Hostinger IP>`   proxy **DNS only** (grey cloud)   TTL Auto
   * `CNAME` name `www` content `ultimatejoystick.com`   proxy **DNS only**
   * Leave any `MX`/`TXT` records alone; add the ones Hostinger shows under Emails -> DNS if you created the mailbox.
2. Wait for `https://ultimatejoystick.com` to answer (minutes to an hour). hPanel -> **Security -> SSL** must show
   a certificate for the domain and `www` (Hostinger issues it automatically once the A record resolves).
3. After the padlock works you may switch the two records to **Proxied** (orange cloud) for Cloudflare's CDN/WAF.
   Set Cloudflare **SSL/TLS -> Full (strict)**, otherwise you get a redirect loop with the `.htaccess` https rule.

**Option B - move DNS to Hostinger:** at the registrar, replace the Cloudflare nameservers with Hostinger's two. Then
hPanel manages the records itself and SSL/e-mail records are added for you. Propagation up to 24 h.

Either way, finish with:
```
node tools/qa-site.mjs --url=https://ultimatejoystick.com
```
and check that `http://www.ultimatejoystick.com/ultimate_joystick.html` ends up at `https://ultimatejoystick.com/`.

## 6. YOU: search engines (15 minutes, free)

1. **Google Search Console** (search.google.com/search-console) -> Add property -> **Domain** `ultimatejoystick.com`
   -> it gives a `TXT` record -> add it in Cloudflare DNS (or hPanel if you did Option B) -> Verify.
   Then **Sitemaps -> add `https://ultimatejoystick.com/sitemap.xml`**. Use **URL Inspection -> Request indexing** on
   `/`, `/order.html`, `/video_demo.html`.
2. **Bing Webmaster Tools** (bing.com/webmasters) -> "Import from Google Search Console" (one click), confirm the
   sitemap.
3. **Rich results**: search.google.com/test/rich-results on the three pages. Expect `Product`, `Organization`,
   `VideoObject` (ten on the video page), `BreadcrumbList`. Fix anything red, then re-request indexing.
4. **PageSpeed**: pagespeed.web.dev on `/`. The home page is heavy on text (the gate game lists); 90+ mobile is
   realistic because there is no JavaScript framework.
5. Google Business Profile: **not eligible** for an online-only shop (same conclusion as Contractors Classroom). If you
   ever sell or install locally from a fixed address, that changes.

## 7. Content decisions that still need the owner (not done by code)

* **VERTICAL gate claim.** The home page lists ~65 games under "Vertical" and says "65+ mapped parent games". The
  shipped `default_games.json` assigns only 5 ROMs (2 parent games: Alpine Ski, Depth Charge) to VERTICAL; `1942`
  and the rest are mapped to SQUARE. Either shrink the claim (copy change) or expand the product data (software
  change). Misleading claims are the first thing Google's merchant/ads policies and a sharp customer notice.
* **Shipping, tax, returns.** The order page shows $100 / $200 with no shipping or returns text. Stripe needs a
  refund policy and the site should link to it (a `policies.html` page is a 20-minute job once you decide the terms).
* **Who sells it.** The footer says "Ultimate Joystick System"; the Organization structured data uses the same name
  and `support@ultimatejoystick.com`. If a legal business name exists, tell the developer and it goes in both.

## 8. After launch, each time something changes

Edit in the `Fable 1. Ultimate_Joystick NEWEST\Website` folder -> run `node tools/qa-site.mjs` and
`node --test stripe-checkout.test.js` -> commit -> push the main repository -> publish the site mirror:

```
git subtree push --prefix=Website site main
```

(`site` is the remote for `sandysavard/ultimatejoystick-website`.) Hostinger's webhook redeploys within a minute.
