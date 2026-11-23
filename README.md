<div align="center">

# Delexo

**A quiet, typographic portfolio for the things I build — and the project deck that holds them.**

[**Live site → delexo.store**](https://delexo.store)

![Website](https://img.shields.io/badge/website-delexo.store-111111?style=flat-square&logo=googlechrome&logoColor=white)
![Hosting](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-111111?style=flat-square&logo=githubpages&logoColor=white)
![Stack](https://img.shields.io/badge/HTML%20%C2%B7%20CSS%20%C2%B7%20JavaScript-vanilla-111111?style=flat-square)
![Dependencies](https://img.shields.io/badge/dependencies-none-111111?style=flat-square)
![Languages](https://img.shields.io/badge/EN%20%2F%20ES-bilingual-111111?style=flat-square)

</div>

![Delexo — expanded project view](.github/preview-desktop.png)

---

## Overview

A single-page personal site built with plain HTML, CSS and JavaScript — no framework, no build step, no dependencies.

The home screen is an infinite deck of projects. Opening one expands it into a case view with the write-up, the stack, the live link and a repository link. The profile and links views live on the same stage: the deck slides aside instead of the page changing abruptly, and every transition is CSS or Web Animations — nothing loads between views.

The whole site is bilingual (English / Spanish) and remembers your choice, works from 320 px phones up to wide desktops, and respects `prefers-reduced-motion`.

## Projects

| | Project | What it is |
|---|---|---|
| 01 | **Mochi** | A Windows AI assistant that docks to the edge of the desktop — chat, music, voice and file actions, local-first. |
| 02 | **Moonrise** | One-click AI websites for local businesses, with a built-in checkout for selling them. |
| 03 | **OrbINT** | An open-source reconnaissance casebook that keeps scattered identifiers in one local case file. |
| 04 | **MusicWidget** | A 4 MB always-on-top music player for Windows with plain-folder playlists. |
| 05 | **GitReplay** | Replays any GitHub repository character by character, with a live HTML/CSS/JS preview. |

## Features

- **Infinite project deck** — wheel, trackpad, arrow keys or the dots step through projects; the deck wraps without a jump.
- **Expanded project view** — title, summary, facts, live site and repository, with a clean slide between projects.
- **Profile view** — bio, skills, certificates and stack, with the deck moving aside rather than disappearing.
- **Links view** — every profile and contact link in one centred 3 × 3 grid, each opening in a new tab.
- **Bilingual copy** — full English and Spanish content, persisted in `localStorage`.
- **Custom cursor and tooltips** — a lightweight pointer and contextual labels follow the pointer on fine pointers only.
- **Discord profile card** — the Discord link opens a small replica of a Discord friend request.
- **Mobile layout** — pinned action bar with safe-area padding, staggered info reveals and swipe-free, scroll-free navigation.

## Preview

<div align="center">
  <img src=".github/preview-mobile.png" width="270" alt="Links view on mobile" />
</div>

## Structure

```text
.
├── index.html                 # markup and the inline SVG favicon
├── styles.css                 # all styling, including the mobile layout
├── main.js                    # copy, projects, view state and animations
├── assets/
│   ├── discord/               # avatar and profile badges
│   ├── icons/                 # stack and skill marks
│   ├── socials/               # link icons used by the deck
│   └── *.png                  # project screenshots for the deck
├── .github/
│   └── preview-*.png          # README screenshots
└── CNAME                      # custom domain for GitHub Pages
```

## Local development

There is nothing to install or build. Serve the folder over HTTP so the relative assets resolve:

```bash
python3 -m http.server 3000
```

Then open <http://localhost:3000>. Any static server works.

## Editing content

Everything the site renders lives in `main.js`:

| What | Where |
|---|---|
| Project names, links, screenshots and write-ups | `projects` |
| English and Spanish interface copy | `copy.en` / `copy.es` |
| Skills and certificates | `copy.*.skillItems` / `certItems` |
| Stack icons | `stack` |
| Social and contact links | `socials` |
| Donate destination | `stripeHref` |

Bump the `?v=` query on `styles.css` and `main.js` in `index.html` when you change either file, so returning visitors get the new build.

## Deployment

The site is served by GitHub Pages straight from the root of `main`:

1. Push to `main`.
2. GitHub Pages rebuilds automatically.
3. `CNAME` keeps it on [delexo.store](https://delexo.store) with HTTPS enforced.

## Links

[Website](https://delexo.store) · [GitHub](https://github.com/Delexoo) · [OrbINT](https://orbint.net)

<div align="center"><sub>© Delexo — Computer Science</sub></div>
