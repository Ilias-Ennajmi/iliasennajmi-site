# Publishing this site

Built with [Astro](https://astro.build). Essays live as Markdown in `src/content/ulysses/` and `src/content/ilias/` and are picked up automatically as Astro content collections — no separate build step compiles them. The browser editor at `/admin/` (Decap CMS) writes those Markdown files for you via Git — no code editing.

## One-time setup (~20 min)

1. **GitHub** — create a repo (private is fine) and push this whole folder. Default branch must be `main` (or change `branch:` in `public/admin/config.yml`).
2. **Netlify** — netlify.com → "Add new site" → "Import an existing project" → pick the repo. Build command and publish dir are read from `netlify.toml` automatically (`npm run build`, publishing `dist`). Deploy.
3. **Enable the editor** — in the Netlify site dashboard:
   - *Integrations → Identity* → Enable Identity.
   - Identity → Registration → set to **Invite only**.
   - Identity → Services → **Enable Git Gateway**.
   - Identity → **Invite user** → your email. Open the invite email, set a password.
4. **Set the site URL** — Site configuration → Environment variables → add `SITE_URL` = your live URL (e.g. `https://iliasennajmi.com`). Used for RSS + sitemap links. Redeploy once after setting it.
5. **Custom domain** (optional, ~$12/yr) — Domain management → Add a domain. Netlify handles DNS + HTTPS.

## Writing an essay

1. Go to `yoursite.com/admin/` and log in.
2. Pick a strand — **Ulysses** (why people act) or **Ilias** (who profits) — and click *New*.
3. Fill in the fields. Formatting in the body: plain paragraphs, the **quote** button for a pull-quote, **H2** for a section heading. `Order: 1` puts it at the top of its list (bump the others down, or use 0 / negative numbers).
4. Click **Publish**. Netlify rebuilds automatically; the essay is live in ~1 minute at `/essays/<slug>/`.

You can also just add/edit `.md` files in `src/content/ulysses/` or `src/content/ilias/` directly on GitHub — same result.

## Local preview

```
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces the static `dist/` folder Netlify deploys; `npm run preview` serves that build locally.
