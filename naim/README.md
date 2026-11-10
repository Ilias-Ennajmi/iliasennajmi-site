# NΛIM — DJ website

One-page site for Naïm, built with [Astro](https://astro.build). It lives in its own folder so it can be deployed separately from the essay site at the repo root.

```
cd naim
npm install
npm run dev        # http://localhost:4321
npm run build      # → naim/dist
```

**Deploy (Vercel or Netlify):** new project from this repo, set **Root directory** to `naim`. Framework preset: Astro. Set `SITE_URL` to the real domain.

## Editing content

Everything lives in **`src/data/naim.ts`**. Anything marked `PLACEHOLDER` is waiting for the real thing.

| What | Where |
| --- | --- |
| Bio, journey text | `bio`, `journey` |
| Performance photos (carousel) | put files in `public/img/live/`, set `src` in `photos` |
| Venues band | `venues` (name + city, or a `logo` image path) |
| Upcoming dates | `dates`. Past dates hide themselves. `type` picks the icon |
| Video sets | `videos`. Set `youtubeId` (the part after `v=`) or `mp4` |
| Spotify | `release.spotifyTrackId`. Until it's set, a branded preview card shows |
| Socials, booking email | `artist`, `socials` |

## Press kit password

The link is encrypted with the password, so it never appears in the page source.

```
npm run presskit -- "the-password" "https://link-to-the-press-kit.pdf"
```

Then commit `src/data/presskit.json` and redeploy. The placeholder password is **`paraiso`**. Unlocking it currently says the kit is "being updated" because no link is set yet.

It's a deterrent, not a vault. Anyone with the password can share the link it opens, so use a link you can revoke (Google Drive, Dropbox).

## Assets

- `public/img/icons/*.png`: the 15 brand icons, cut from the icon sheet with transparent backgrounds
- `public/img/logo.png`: the logo as an alpha mask (CSS colours it, so it works in any colour)
- `public/img/naim-*.webp`: the hero photo in three sizes
