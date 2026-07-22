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
| Yellow | comparing |
| Red | swapping / removing |
| Green | sorted / found / success |
| Blue | pointer / pivot / current position |
| (default gray/neutral) | untouched / inactive |

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
