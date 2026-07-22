# Decisions: "30 Days of DSA in JavaScript — Interview Ready"

Phase 0.5 — tech + environment decisions, locked before Phase 1 build starts.
See [RESEARCH.md](./RESEARCH.md) for source research and license verification.

---

## 1. Environment check

- **Git:** repo initialized at `/Users/zain/projects/dsa` (`git init`, default branch `main`).
  RESEARCH.md is staged as the first commit (not yet committed — will commit once this file
  is approved, so the first commit bundles both Phase 0 docs together).
- **Local preview:** Python 3.13.3 is available. To preview the site while building, run from
  the project root:

  ```bash
  python3 -m http.server 8000
  ```

  Then open **http://localhost:8000/** in a browser. (A plain `python3 -m http.server` also
  works for opening `index.html` directly at `file://` — see note below on why we still use a
  server for dev.)

  We use a local server instead of double-clicking `index.html` **during development** because
  some browsers restrict `fetch`/module loading over `file://`. That said, this site is required
  to also work when opened directly via `file://` for GitHub Pages parity checks — see the
  "definition of done" item on this in the checklist below. We avoid `fetch()` and ES modules
  entirely (plain `<script src="...">` tags, everything inline-executable) specifically so
  `file://` works with zero server, matching the constraint in the original spec.

---

## 2. Tech decisions — zero libraries, confirmed

**Default choice: zero libraries. Nothing to approve here beyond confirming this stays vanilla.**

- **Diagrams:** hand-written inline SVG, authored directly in each lesson's HTML (or generated
  once and pasted in — no diagram library, no Mermaid, no external renderer).
- **Animations:** our own engine, `js/engine.js`, vanilla JS + SVG/DOM manipulation (no Canvas
  library, no D3, no GSAP).
- **Charts (Day 2 Big-O growth curves):** SVG line/curve paths drawn by our own small plotting
  function inside `js/engine.js` (or a dedicated helper) — plots O(1)/O(log n)/O(n)/O(n log n)/
  O(n²)/O(2ⁿ) curves from plain math, no charting library.
- **No CDN links anywhere.** No `<script src="https://...">`, no Google Fonts link, no icon
  fonts. System font stack in CSS (`-apple-system, "Segoe UI", Roboto, monospace` fallbacks for
  headings) so nothing needs to be vendored just for typography.
- **No library was found necessary for anything in this course.** (Mermaid was considered for
  the Day 28 pattern-decision flowchart, per the spec's example — decision: hand-authored SVG
  is simple enough for that one flowchart too, so we skip vendoring anything. If this changes
  during Day 28 build, I will stop and ask before adding a vendored library.)

### Visual-type mapping (which engine mode renders which topic)

| Visual type | Engine mode | Used for |
|---|---|---|
| Bars (array as vertical bars, color-coded) | `engine.bars` | Day 3–8, 10–14: arrays, two-pointer, sliding window, all sorting, binary search + variations |
| Nodes + arrows (linked list / tree / graph) | `engine.graph` | Day 15–20, 23–24: linked lists, stacks/queues-as-node-chains where helpful, trees, BST, graphs |
| Grid / table (2D cells, color-coded fill) | `engine.grid` | Day 25–26: DP tables (fibonacci, climbing stairs, coin change, house robber); Day 18 sliding-window-maximum deque state |
| Call-stack panel (stacked frames, push/pop) | `engine.callstack` | Day 9 (recursion), reused inside Day 25–26 for memoized recursive calls |
| Flowchart (decision tree, SVG) | hand-authored SVG (no reusable engine mode — one-off) | Day 28 pattern-recognition decision guide |
| Heap-as-tree (nodes+arrows, specialized) | `engine.graph` (tree layout mode) | Day 22 heaps/priority queues |

All four reusable engine modes (`bars`, `graph`, `grid`, `callstack`) share one **Play / Step /
Reset / Shuffle** control bar and one narration line element, per the spec's "one reusable
animation engine" requirement — each mode is a renderer plugged into the same step-sequence
player, not a separate animation system.

### Color legend (used identically across every visualization, every lesson)

| Color | Meaning |
|---|---|
| Amber/yellow | comparing |
| Red | swapping / removing |
| Mint green | sorted / found / success |
| Teal | pointer / pivot / current position |
| Soft plum/purple | active / currently executing (e.g. call stack frame) |
| (default warm neutral) | untouched / inactive |

---

## 2.5. Design pivot(s): dark → light/cream → "One Dark Pro" dark (post-Day-10)

After Days 1–10 shipped under the original dark theme (§2 above), the theme changed **twice**
in the same session. History, in order, since each pivot's mechanics matter for future changes:

1. **Dark → light/cream.** User supplied a full warm light-theme spec (cream background, white
   cards, dark-green/teal/mint) for reading comfort. Fully executed and verified in-browser.
2. **Light/cream → "One Dark Pro" dark.** User then asked to soften the cream background
   (still felt too bright), and separately asked for the exact color scheme of the popular VS
   Code theme **[One Dark Pro](https://github.com/Binaryify/OneDark-Pro)** — a dark,
   IDE-familiar palette, fitting for a programming-focused study site. **This is the current,
   final theme.** Hex values were pulled directly from the real theme source (not approximated
   from memory): `themes/OneDark-Pro.json` (`editor.background`, `sideBar.background`,
   `button.background`, `textLink.foreground`, `focusBorder`) and
   `scss/atom-one-dark-inside.scss` (the `hue-1..6` syntax-highlight colors) via `gh api` +
   `curl` against the live repo.

**Mechanics that apply to ANY future theme change on this site (read this before changing
colors again):**
- **`css/tokens.css` is now the single source of truth for every color/font/radius token** —
  extracted out of `style.css` specifically so future palette changes are a one-file edit.
  `style.css` pulls it in via `@import url('tokens.css');` (must stay the first real rule in the
  file, comments are fine before it). Component CSS in `style.css` should never hardcode a
  color — always reference a `--token`.
- **Every lesson's hand-drawn SVG diagrams hardcode hex colors directly — they do NOT read CSS
  variables.** This means `tokens.css` alone is not enough; every theme change also requires a
  **sitewide find-replace across `lessons/*.html`** (and Day 2's inline `SERIES` chart colors,
  which live in a `<script>` tag, not CSS). Process used both times, safe to repeat:
  1. `grep -oE '#[0-9a-fA-F]{6}' lessons/*.html js/*.js | sort | uniq -c | sort -rn` — confirm
     the site still only uses a small, closed set of hex constants (it does, by discipline).
  2. For any hex value being reused as a *different* meaning in the new palette, check its
     actual usage context first (`grep -oE '.{20}#HEXVALUE.{10}'`) before batch-replacing — a
     value like `#FFFFFF` can mean different things depending on where it appears.
  3. Run one `sd -s '#OLD' '#NEW'` per mapping across `lessons/*.html js/*.js`. Order-safe as
     long as no new target hex equals another old source hex (verify before running).
  4. **Favicons are separately encoded** — the `<link rel="icon">` data URI percent-encodes `#`
     as `%23`, so plain hex find-replace never touches them. Needs its own
     `sd -s "fill='%23OLD'" "fill='%23NEW'"` pass.
  5. Re-verify in-browser afterward across every renderer type used so far (Bars, the Day 2
     chart, the Day 9 CallStack, Graph-style tree diagrams) with a hard reload
     (`ignoreCache: true`) — browsers (and this project's own dev server) cache CSS/JS
     aggressively, so a stale render can look like a bug that isn't one.
- **Legend swatches (`.legend i`) always get a border** (currently a light rgba tint) —
  necessary because a "neutral" state color can end up close in luminance to the page
  background depending on the palette, making an unbordered swatch nearly invisible. Keep this
  border on any future palette.

**Font:** JetBrains Mono is first in the `--font-head` stack (headings/code), per explicit user
request. Body paragraph text stays a readable sans-serif system stack, not monospace — full body
monospace would work against long-session readability. **Not yet vendored** — JetBrains Mono
isn't bundled as a font file, so most readers see a system monospace fallback (Menlo/Consolas/
etc.), not literal JetBrains Mono. Vendoring it (self-hosted, offline-safe, OFL-licensed) is a
flagged, not-yet-actioned follow-up — ask the user before adding it (matches the "check license,
vendor, ask first" rule in §2 above).

**Process note for any FUTURE lesson (Day 11 onward):** write directly in the current
`tokens.css` palette from the start — do not reuse any prior theme's hex values. If the theme
changes again before Day 30 is done, re-run the sitewide find-replace process above rather than
leaving old and new lessons on different palettes.

---

## 3. Definition of done — per lesson, verified before moving to the next

Before any lesson page is considered finished:

1. Page opens with **zero console errors** (checked via browser devtools or a headless check).
2. Animation **Play, Step, Reset, and Shuffle** all work, and the **narration text matches**
   exactly what the visual is doing at each step (no mismatched or stale narration).
3. **Quiz** gives correct instant feedback (right/wrong marked correctly for all 5 questions).
4. Page is **readable at 375px width** (mobile check — no horizontal scroll, no clipped text).
5. Page **works opened directly from disk** (`file://.../lessons/dayXX.html`) — no network
   requests, no fetch, no ES module `import` that `file://` would block.

This checklist will be re-run for every one of the 30 lessons, not just spot-checked.

---

## 4. Build order (unchanged from the spec's working method)

1. `js/engine.js` + `css/style.css` + `index.html` (the shared foundation everything else uses).
2. Week 1 (Days 1–7) — verify each animation before moving on.
3. Week 2 (Days 8–14).
4. Week 3 (Days 15–21).
5. Week 4 (Days 22–30).
6. `README.md` with exact GitHub Pages deploy steps.

`NOTES.md` will be created and kept current once Phase 1 starts, tracking what's done/remaining
so work can resume in a new session if needed.

---

**Nothing above requires a library approval decision from you** — everything is vanilla,
dependency-free, matching the spec's default. Flagging for your explicit sign-off before Phase 1
begins, as required.
