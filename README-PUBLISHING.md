# Publishing this site

Built with [Astro](https://astro.build). Essays live as Markdown in `src/content/ulysses/` and `src/content/ilias/` and are picked up automatically as Astro content collections — no separate build step compiles them. The browser editor at `/admin/` (Decap CMS, authenticated via [DecapBridge](https://decapbridge.com)) writes those Markdown files for you via Git — no code editing required to publish.

## One-time setup

1. **GitHub** — this repo is already pushed to [Ilias-Ennajmi/iliasennajmi-site](https://github.com/Ilias-Ennajmi/iliasennajmi-site), default branch `main`.
2. **Netlify** — already deployed at `iliasennajmi-site.netlify.app`, auto-deploying on every push to `main`.
3. **The `/admin/` editor** — already wired to DecapBridge (see `public/admin/config.yml`). Log in at `/admin/` with whatever you set up in your DecapBridge account.
4. **Set the site URL** — Site configuration → Environment variables → `SITE_URL` = your live URL. Used for canonical links, RSS, sitemap, and OG images. Redeploy once after changing it.
5. **Custom domain** (optional) — Domain management → Add a domain in Netlify.
6. **Analytics** (optional) — sign up at [plausible.io](https://plausible.io), then set the `PUBLIC_PLAUSIBLE_DOMAIN` environment variable in Netlify to your domain. Leave it unset and no analytics script loads at all.

## Writing an essay

1. Go to `yoursite.com/admin/` and log in.
2. Pick a strand — **Ulysses** (why people act) or **Ilias** (who profits) — and click *New*.
3. Fill in the fields:
   - **Draft** — on by default; flip off to actually publish.
   - **Read time** — leave blank to auto-calculate from word count, or set it manually.
   - **Pairs with** — the URL slug of the best-matching essay in the *other* strand. Powers the "now see who profits / now ask why people act" suggestion at the bottom of the essay.
   - **Start Here order** — set 1–4 to include the essay in the curated onboarding path at `/start/`.
   - **Body** — plain paragraphs, bold/italic/links/lists/images/code all work now. Use the **quote** button for a pull-quote, **H2** for a section heading. For a margin sidenote, type it manually as `text[^1]` plus a `[^1]: note` line anywhere in the body — it becomes a Tufte-style margin note on wide screens, or a tap-to-reveal note on narrow ones.
4. Click **Publish**. Netlify rebuilds automatically; the essay is live in ~1 minute at `/essays/<slug>/`.

You can also just add/edit `.md` files in `src/content/ulysses/` or `src/content/ilias/` directly on GitHub — same result.

## What else is on the site

- **`/start/`** — a hand-curated 3-4 essay onboarding path (edit via `startHereOrder` in each essay's frontmatter).
- **`/topics/`** — every essay browsable by tag, across both strands.
- **`/colophon/`** — build-time stats (essay count, word count, reading time) and a short "built with" note.
- **⌘K / Ctrl+K** — a search palette, available on every page, indexing all essays and pages (`/search-index.json`).
- **`/rss.xml`** — full-content feed (not just teasers). **`/llms.txt`** — a structured summary for AI crawlers.
- **OG share images** — auto-generated per essay at `/og/<slug>.png`, branded with the strand's accent color.
- **Offline reading** — a service worker caches pages you've visited so they stay readable without a connection (production builds only, not local dev).
- **Print** — essay pages have a dedicated print stylesheet (no nav/footer/chrome, just the text).

## Local preview

```
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces the static `dist/` folder Netlify deploys; `npm run preview` serves that build locally (closer to production — this is what actually registers the service worker, unlike `dev`).
