# Build Notes — 30 Days of DSA in JavaScript

Tracks what's done and what's left so work can resume in a new session.
See [RESEARCH.md](./RESEARCH.md) and [DECISIONS.md](./DECISIONS.md) for the approved plan.

## Repo
- GitHub: https://github.com/zainulhasan/30-days-js-interview-prep (public)
- Local git identity for this repo only: `Zain <hassan9224@gmail.com>`
- Hosting plan: GitHub Pages, deployed from `main` — not yet enabled (do after enough
  lesson content exists to be worth publishing, or now if the user wants an early live URL).

## Done (Phase 1, part 1 — foundation)
- `js/engine.js` — StepPlayer (Play/Step/Reset/Shuffle + narration + step counter) with four
  renderers: `Bars`, `Graph` (nodes+arrows, SVG), `Grid` (DP tables), `CallStack` (recursion).
  Also: `wireQuiz` (multiple-choice + instant feedback) and `wireReveals` (hints/solutions
  behind a click). Shared color-state classes (compare/swap/sorted/pointer/active) match the
  legend in DECISIONS.md.
- `js/progress.js` — localStorage progress tracker (`DSAProgress`): isDone/setDone/toggle,
  completedCount, firstIncompleteDay, last-visited day.
- `js/curriculum.js` — the 30-day roadmap data (day/week/title/blurb) + week metadata, shared
  by index.html and (to be) every lesson page's prev/next nav.
- `css/style.css` — dark theme, monospace headings, full color legend, all four visualizer
  renderer styles, quiz/reveal/complexity-table/dry-run-table styles, responsive down to 375px.
- `index.html` — home page. Hero, progress bar, continue-where-you-left-off button, and the
  **30-day roadmap as a week-grouped detail list** (not a card grid — changed per user request
  mid-build: each row = day badge + title + one-line blurb + status/chevron, grouped under
  4 week headers each showing "X/Y done"). Verified in-browser: zero console errors, works at
  375px mobile width (blurb + status text hide, row stays single-line), done-state (green
  badge/border/checkmark) confirmed by toggling localStorage directly.

## Explicitly decided during build (beyond DECISIONS.md)
- User asked about using Tailwind UI for styling. Declined: Tailwind UI is a paid, non-vendorable
  component library, and even MIT Tailwind CSS would require a real rewrite for no offline/build
  benefit over the already-built custom CSS. **Staying with the hand-written CSS system.**
- Roadmap section on the home page is a **week-grouped list with detail rows**, not the 6×5 card
  grid originally sketched in the spec — user asked for "list format with details" after seeing
  the card version. This is now the pattern; do not reintroduce the card grid.

## Not started yet
- Individual lesson pages `lessons/day01.html` … `day30.html` (this is the bulk of the work —
  each needs: goal, concept, SVG diagram, engine-driven animation, commented code, complexity
  table, interview corner, 3 practice problems w/ hidden hints+solutions, 5-question quiz,
  prev/next nav + mark-complete button). Build order per DECISIONS.md: Week 1 (Days 1–7) first,
  verify each in-browser, then Weeks 2–4.
- Shared lesson page chrome/template hasn't been finalized as a literal template file — first
  lesson (Day 1) will establish the pattern; keep it consistent across all 30 after that.
- `README.md` with GitHub Pages deploy steps — write last, per the spec's working method.
- GitHub Pages not yet enabled in repo settings.

## Environment for local preview
```bash
cd /Users/zain/projects/dsa
python3 -m http.server 8000
# open http://localhost:8000/
```
(A background server was running on port 8791 during this session for verification via
Chrome DevTools MCP — kill/restart as needed in a new session.)
