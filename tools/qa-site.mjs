#!/usr/bin/env node
/*
 * Ultimate Joystick website quality gate. No dependencies.
 *
 *   node tools/qa-site.mjs                       # check the files in this folder
 *   node tools/qa-site.mjs --url=https://ultimatejoystick.com   # also check the live site
 *
 * Checks: every local href/src/poster/track resolves to a real file; each public page has one <title>,
 * a meta description (50-170 chars), a canonical URL, og:title/og:description/og:image, exactly one <h1>;
 * every JSON-LD block parses; sitemap <loc> entries map to real files; no http:// resources except the
 * local purchase-test link; the legacy twin page is noindex. With --url: status codes, redirects
 * (http -> https, www -> apex, /ultimate_joystick.html -> /, /index.html -> /), 404 page, security headers.
 * Exit code 1 when anything fails.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const liveUrl = (process.argv.find((a) => a.startsWith("--url=")) || "").slice(6).replace(/\/+$/, "");
const PUBLIC_PAGES = ["index.html", "order.html", "video_demo.html"];
const ALL_PAGES = [...PUBLIC_PAGES, "ultimate_joystick.html", "404.html"];
const SITE = "https://ultimatejoystick.com";

let failures = 0;
const ok = (msg) => console.log(`ok    ${msg}`);
const fail = (msg) => { failures += 1; console.log(`FAIL  ${msg}`); };
const warn = (msg) => console.log(`warn  ${msg}`);

const read = (rel) => readFileSync(join(root, rel), "utf8");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, "i")) || tag.match(new RegExp(`\\s${name}\\s*=\\s*'([^']*)'`, "i"));
  return m ? m[1] : null;
};
const metaContent = (html, selector) => {
  const re = new RegExp(`<meta\\s+[^>]*${selector}[^>]*>`, "gi");
  const tags = html.match(re) || [];
  return tags.map((t) => attr(t, "content")).filter(Boolean);
};

// ---------- 1. file-level checks ----------
for (const page of ALL_PAGES) {
  if (!existsSync(join(root, page))) { fail(`${page} missing`); continue; }
  const html = read(page);
  const isPublic = PUBLIC_PAGES.includes(page);

  const titles = html.match(/<title>[^<]*<\/title>/gi) || [];
  titles.length === 1 ? ok(`${page}: one <title>`) : fail(`${page}: ${titles.length} <title> tags`);

  const desc = metaContent(html, 'name="description"');
  if (desc.length !== 1) fail(`${page}: ${desc.length} meta descriptions`);
  else if (desc[0].length < 50 || desc[0].length > 170) warn(`${page}: description is ${desc[0].length} chars (aim 50-160)`);
  else ok(`${page}: meta description ${desc[0].length} chars`);

  const h1s = html.match(/<h1[\s>]/gi) || [];
  h1s.length === 1 ? ok(`${page}: one <h1>`) : fail(`${page}: ${h1s.length} <h1> tags`);

  if (isPublic) {
    const canon = (html.match(/<link[^>]+rel="canonical"[^>]*>/i) || [null])[0];
    const href = canon && attr(canon, "href");
    href && href.startsWith(SITE) ? ok(`${page}: canonical ${href}`) : fail(`${page}: canonical missing or not on ${SITE}`);
    for (const p of ["og:title", "og:description", "og:image", "og:url"]) {
      metaContent(html, `property="${p}"`).length === 1 ? ok(`${page}: ${p}`) : fail(`${page}: ${p} missing/duplicated`);
    }
    if (/name="robots"[^>]*noindex/i.test(html)) fail(`${page}: public page is noindex`);
  } else if (!/name="robots"[^>]*noindex/i.test(html)) {
    fail(`${page}: should carry <meta name="robots" content="noindex">`);
  } else ok(`${page}: noindex`);

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const [, body] of blocks) {
    try {
      const data = JSON.parse(body);
      const types = (data["@graph"] || [data]).map((n) => n["@type"]).join(", ");
      ok(`${page}: JSON-LD parses (${types})`);
    } catch (e) { fail(`${page}: JSON-LD does not parse - ${e.message}`); }
  }

  // local references
  const refs = [...html.matchAll(/\s(?:href|src|poster)="([^"#?]+)[^"]*"/gi)].map((m) => m[1]);
  let missing = 0;
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/i.test(ref)) {
      if (/^http:\/\//i.test(ref) && !/127\.0\.0\.1|localhost/.test(ref)) fail(`${page}: insecure http:// reference ${ref}`);
      continue;
    }
    const target = ref.startsWith("/") ? join(root, ref) : join(root, dirname(page), ref);
    if (!existsSync(target)) { missing += 1; fail(`${page}: broken reference ${ref}`); }
  }
  if (!missing) ok(`${page}: all ${refs.filter((r) => !/^(https?:|mailto:|data:)/i.test(r)).length} local references resolve`);

  // in-page anchors
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, file, anchor] of html.matchAll(/href="(?:\.\/)?([a-z0-9_-]+\.html)?#([^"]+)"/gi)) {
    if (file && file !== page) {
      // cross-page anchor: the id must exist in the other page
      const otherIds = existsSync(join(root, file)) ? new Set([...read(file).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) : new Set();
      if (!otherIds.has(anchor)) fail(`${page}: anchor ${file}#${anchor} has no matching id in ${file}`);
    } else if (!ids.has(anchor)) {
      fail(`${page}: anchor #${anchor} has no matching id`);
    }
  }
}

// ---------- 2. sitemap / robots ----------
const sitemap = read("sitemap.xml");
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (!loc.startsWith(SITE)) { fail(`sitemap: ${loc} not on ${SITE}`); continue; }
  const rel = loc.slice(SITE.length).replace(/^\//, "") || "index.html";
  existsSync(join(root, rel)) ? ok(`sitemap: ${loc}`) : fail(`sitemap: ${loc} has no file`);
}
for (const [, loc] of sitemap.matchAll(/<video:(?:content_loc|thumbnail_loc)>([^<]+)</g)) {
  const rel = loc.slice(SITE.length).replace(/^\//, "");
  if (!existsSync(join(root, rel))) fail(`sitemap video asset missing: ${rel}`);
}
/Sitemap:\s*https:\/\/ultimatejoystick\.com\/sitemap\.xml/.test(read("robots.txt")) ? ok("robots.txt lists the sitemap") : fail("robots.txt sitemap line");

// ---------- 3. stripe config sanity ----------
const stripe = read("stripe-config.js");
const mode = (stripe.match(/mode:\s*"(\w+)"/) || [])[1];
const links = [...stripe.matchAll(/https:\/\/buy\.stripe\.com\/(test_)?[A-Za-z0-9]+/g)];
if (mode === "test" && links.length) warn(`stripe-config.js is mode "test" with ${links.length} live-looking buttons: visitors reach a TEST checkout (see deploy/hostinger/README.md step 4)`);
else if (mode === "live" && links.some((l) => l[1])) fail("stripe-config.js says live but contains test_ links");
else ok(`stripe-config.js mode ${mode}, ${links.length} links`);

// ---------- 4. live checks ----------
async function head(url, redirect = "manual") {
  const res = await fetch(url, { method: "GET", redirect, headers: { "user-agent": "uj-qa/1.0" } });
  return res;
}
if (liveUrl) {
  const apex = liveUrl.replace(/^https?:\/\//, "");
  const isTemp = !apex.endsWith("ultimatejoystick.com");
  for (const path of ["/", "/order.html", "/video_demo.html", "/sitemap.xml", "/robots.txt", "/styles.css", "/videos/ultimate-joystick/09-complete-start-to-finish.mp4"]) {
    try {
      const res = await head(liveUrl + path, "follow");
      res.ok ? ok(`live ${path} -> ${res.status}`) : fail(`live ${path} -> ${res.status}`);
    } catch (e) { fail(`live ${path} -> ${e.message}`); }
  }
  try {
    const res = await head(liveUrl + "/this-page-does-not-exist", "follow");
    res.status === 404 ? ok("live 404 status for unknown page") : fail(`live unknown page -> ${res.status} (expected 404)`);
    const body = await res.text();
    /Error 404/.test(body) ? ok("live branded 404 page served") : fail("live 404 is not the branded page (.htaccess ErrorDocument)");
  } catch (e) { fail(`live 404 check -> ${e.message}`); }
  for (const path of ["/deploy/hostinger/README.md", "/tools/qa-site.mjs", "/stripe-checkout.test.js"]) {
    try {
      const res = await head(liveUrl + path, "follow");
      res.status === 403 || res.status === 404 ? ok(`live ${path} blocked (${res.status})`) : fail(`live ${path} is served (${res.status})`);
    } catch (e) { fail(`live ${path} -> ${e.message}`); }
  }
  try {
    const res = await head(liveUrl + "/", "follow");
    for (const h of ["x-content-type-options", "x-frame-options", "referrer-policy", "content-security-policy"]) {
      res.headers.get(h) ? ok(`live header ${h}`) : fail(`live header ${h} missing (.htaccess mod_headers)`);
    }
    if (!isTemp) res.headers.get("strict-transport-security") ? ok("live HSTS") : fail("live HSTS missing");
  } catch (e) { fail(`live headers -> ${e.message}`); }
  if (!isTemp) {
    const redirects = [
      ["http://ultimatejoystick.com/", "https://ultimatejoystick.com/"],
      ["https://www.ultimatejoystick.com/", "https://ultimatejoystick.com/"],
      ["https://ultimatejoystick.com/ultimate_joystick.html", "https://ultimatejoystick.com/"],
      ["https://ultimatejoystick.com/index.html", "https://ultimatejoystick.com/"],
    ];
    for (const [from, to] of redirects) {
      try {
        const res = await head(from, "manual");
        const loc = res.headers.get("location");
        res.status === 301 && loc === to ? ok(`live 301 ${from} -> ${to}`) : fail(`live ${from} -> ${res.status} ${loc || ""} (expected 301 ${to})`);
      } catch (e) { fail(`live redirect ${from} -> ${e.message}`); }
    }
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL CHECKS PASSED");
process.exit(failures ? 1 : 0);
