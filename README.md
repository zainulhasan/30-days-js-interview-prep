# 30 Days of DSA in JavaScript — Interview Ready

*From dummy to dummies.*

A free, self-paced Data Structures & Algorithms course for JavaScript interview prep.
Every lesson has a diagram, an interactive step-through animation, a line-by-line dry run,
real interview questions, practice problems, and a quiz — all in plain English.

**Pure static site.** No frameworks, no npm dependencies, no build step, no CDNs. It works by
opening `index.html` directly, or by serving the folder with any static file server, and it
works fully offline.

## Live site

Once GitHub Pages is enabled (see below), the course is live at:

**https://dsa.itszain.tech/** (custom domain, via the repo's `CNAME` file)

or the default GitHub Pages URL:

**https://zainulhasan.github.io/30-days-js-interview-prep/**

## Run it locally

No install step — any static file server works. From the project root:

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000/** in a browser. You can also just double-click
`index.html` — the site makes no network requests and works fine opened directly from disk.

## Project structure

```
/
├── index.html          → home: course intro, 30-day roadmap, progress tracker
├── css/style.css        → shared stylesheet — dark theme, mobile-friendly
├── js/engine.js          → reusable Play/Step/Reset/Shuffle animation engine
├── js/progress.js        → localStorage progress tracking
├── js/curriculum.js      → the 30-day roadmap data
├── lessons/day01.html … day30.html
└── .docs/                → planning docs (research, tech decisions, build notes)
```

## Deploying to GitHub Pages

This repo is already set up on GitHub. To (re-)enable Pages:

1. Go to the repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` and the folder to `/ (root)`, then **Save**.
4. Wait a minute for the first deploy, then the site is live at:
   `https://<your-github-username>.github.io/<repo-name>/`

Every future push to `main` redeploys automatically — no CI config needed for a plain static
site like this one.

## Credits

Course content, the visualizer engine, and all lesson code are original. Curriculum breadth
and interview-question coverage were cross-checked against several open-source references —
see **[.docs/RESEARCH.md](.docs/RESEARCH.md)** for the full source list, verified licenses, and
exactly what was (and wasn't) reused from each one.

## More docs

- [.docs/RESEARCH.md](.docs/RESEARCH.md) — sources, license verification, what we reused vs. built ourselves
- [.docs/DECISIONS.md](.docs/DECISIONS.md) — tech stack decisions, visual-type mapping, definition of done
- [.docs/NOTES.md](.docs/NOTES.md) — build progress tracker (what's done, what's left)
