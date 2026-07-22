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
- Planning docs (RESEARCH.md, DECISIONS.md, NOTES.md) live in **`.docs/`**, not repo root —
  moved via `git mv` per user request to keep the root clean. Root-relative links to them
  (e.g. index.html footer) must point at `.docs/<file>.md`.
- `README.md` added at repo root with project overview + exact GitHub Pages deploy steps.
- Repo owner is GitHub user **zainulhasan** (not the machine's default `gh` account,
  `zaindarasa`) — see "gh account gotcha" below, this matters for every future push/PR/gh call.

## Lesson template — established and validated on Day 1, apply to every remaining lesson
`lessons/day01.html` is the reference pattern. Key decisions baked into it that must carry
forward to Days 2–30:
- **Multiple diagrams/visualizations per lesson are fine** (even expected) when one concept
  doesn't cover everything — Day 1 has one SVG diagram (2 stacked sections: push/pop vs.
  unshift/shift) and **two separate** interactive Play/Step/Reset/Shuffle animations (mutation
  methods, then destructuring/spread), not one combined viz. Split when it makes each one
  clearer; don't force everything into a single diagram/animation just because the spec says
  "a diagram"/"an animation" (singular in the spec ≠ a hard cap of one).
- **Use medium-sized examples, not trivial ones** — user explicitly asked for 5-element arrays
  instead of 3-element ones ("jr devs need to understand things in details"). Default to ~5
  elements (or equivalent) for every lesson's running example, not the smallest example that
  technically works.
- **SVG text does not wrap** — long caption lines silently get clipped at the viewBox edge.
  Keep every `<text>` line short (under ~60 chars at font-size 12 in our diagram width) or
  split across multiple `<text>` elements on separate y-coordinates. Always visually verify
  diagrams in-browser (zoom/screenshot) after writing them — don't trust coordinate math alone,
  this exact overlap/clipping bug happened twice on Day 1 before being caught by rendering it.
- **Cross-section consistency is the easiest thing to get wrong** — the diagram, the animation's
  narration, the code sample, the dry-run table, and the complexity table must all use the
  *same* example values and operations. A content-advisor review caught a real bug (animation
  said `push(10)`, code/diagram said `push(6)`) and a second one after the fix (diagram's new-
  element color contradicted the legend/animation). Whenever example values are hardcoded in
  more than one place, double check them against each other before moving on.
- **LeetCode "links" must be real `<a href>` tags** to the actual problem URL
  (`https://leetcode.com/problems/<slug>/`), not plain text naming the problem.
- **Verify difficulty labels against the actual LeetCode page** — don't guess Easy/Medium/Hard.
- **Interview Corner needs explicit structure**, not just a paragraph per question: at least one
  item should have a labeled "↳ Common follow-up:" chain, and gotchas should be called out with
  an explicit "⚠ Trap:" label rather than folded silently into a regular answer.
- **Practice-problem hints should point at the right tool, not restate the algorithm** — a hint
  that gives away the full approach in prose isn't a hint.
- **After every lesson is content-complete, run it through a fresh review pass** (a subagent
  with no context from the writing session, told to be skeptical) checking: factual accuracy,
  cross-section consistency, section completeness against the spec's required list, quiz
  quality (exactly one defensible correct answer per question), practice-problem quality
  (hints/solutions/links/difficulty), beginner-friendliness, and anything an interviewer would
  flag as wrong/misleading. Fix what it finds before moving to the next lesson — do this for
  every lesson, not just Day 1 (Day 1 got this treatment; it found 5 must-fix + 5 nice-to-have
  issues that would otherwise have been copied into 29 more lessons).

## gh account gotcha (recurring — check every session)
This machine has **multiple `gh` accounts** logged in (`zaindarasa`, `s3-devops-team`,
`zainulhasan`), and the active one is a **global, machine-wide setting** that other concurrent
agent sessions can and do change without warning (observed mid-session: active account flipped
from `zainulhasan` back to `zaindarasa` between two git operations in the same conversation).
`zaindarasa` does NOT have push access to `zainulhasan/30-days-js-interview-prep`.
**Before every `gh`/git-push/PR operation on this repo:** run
`gh auth status 2>&1 | grep -B1 "Active account: true"` and if it's not `zainulhasan`, run
`gh auth switch --user zainulhasan` immediately before the operation (not earlier — it can flip
again in between). Repo-local git config already bypasses the system osxkeychain credential
cache (see `git config --local --get-all credential.helper`), so once the correct account is
active, `git push` works.

## Done — Day 1 lesson (`lessons/day01.html`)
Covers: array push/pop/shift/unshift (O(1) end vs O(n) front, with a why-focused SVG diagram),
index access, destructuring, spread — 5-element running example throughout. Two interactive
animations (mutation methods; destructuring+spread). Dry run, complexity table (with footnotes
disambiguating "n" and marking amortized O(1)), interview corner (5 Q&A, 2 with explicit
follow-ups, 2 with explicit trap callouts), 3 Easy practice problems with real LeetCode links,
hints, and solutions (one solution uses `.entries()` destructuring to tie back to the lesson),
5-question quiz. Went through a full content-advisor review round-trip (found and fixed real
bugs — see "Lesson template" section above). Verified in-browser: zero console errors, both
animations' Play/Step/Reset/Shuffle all work and narration matches the visual/color state,
quiz gives correct instant feedback, reveals toggle correctly, mark-complete writes to
localStorage and undoes correctly, no horizontal overflow at ~375-427px width.

## Done — Day 2 lesson (`lessons/day02.html`)
Big-O notation: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ). Diagram + interactive viz are
both a hand-drawn SVG growth-curve chart (approved deviation from the Bars/Graph/Grid/CallStack
engine for this one lesson only, per DECISIONS.md) — same chart-drawing function powers both the
static reference chart and the animated Play/Step/Reset/Shuffle version with a live per-n
operations table. Complexity table covers all 6 classes with time/space/why. Went through a
full content-advisor review round-trip; fixed real issues (Two Sum mislabeled Medium instead of
Easy, complexity table missing the required Space column, a quiz explanation that invented a
false "crossover point" between O(n²) and O(n log n), chart not rescaling its x-axis after
Shuffle picked a smaller n-range, thin code coverage for 2 of the 6 classes). Verified in-browser:
zero console errors, animation narrations/values all recomputed and correct, quiz/reveal/mark-
complete all work, mobile width has no overflow (added an overflow-x:auto wrapper around the
7-column live table — note for future lessons: any table with many columns or number-heavy
cells that can't word-wrap needs this wrapper, not just wide-text tables).

## Review process is now standardized
See `.docs/REVIEW-CHECKLIST.md` — every lesson gets a content-advisor review dispatched with a
short prompt pointing at that checklist (template prompt included in the file), instead of
re-writing full criteria each time. Both Day 2 and Day 3 reviews found real must-fix bugs using
it (Day 3: a flatly-wrong "string mutation never throws" claim — it does under strict mode/
modules/classes — repeated in 6+ places, and a viz that colored buggy leftovers green/"correct"
while narrating them as wrong). Keep using this file and its dispatch template for every
remaining lesson.

**Testing gotcha:** the Chrome DevTools MCP browser can serve a stale cached `js/engine.js`
after editing it — always reload with `type: reload, ignoreCache: true` (not a plain `navigate`)
after changing shared JS, and spot check via `DSA.Bars.toString().includes('<new code>')` if a
feature seems to silently not work — it may just be cache, not a real bug.

## Done — Day 3 lesson (`lessons/day03.html`)
Core string ops (slice/indexOf/includes/split/charAt), string immutability (with an accurate
strict-mode-throws hedge after review caught the unhedged version), and the mutate-while-
iterating array bug (forEach+splice skipping elements). Extended `js/engine.js`'s `Bars` with a
`uniform: true` mode (fixed-height bars, non-numeric labels) to visualize string characters —
reusable by any future lesson that needs to show a string as boxes. Two interactive
visualizations. Reviewed and fixed (see above). Verified in-browser incl. the new uniform-bars
rendering.

## Not started yet
- Lesson pages `lessons/day04.html` … `day30.html` — use Days 1-3 as the template, apply every
  point in "Lesson template" above, review each via `.docs/REVIEW-CHECKLIST.md` before moving
  on. Build order per DECISIONS.md: rest of Week 1 (Days 4–7) next, then Weeks 2–4.
- GitHub Pages not yet enabled in repo settings (Settings → Pages → Deploy from branch `main`).

## Environment for local preview
```bash
cd /Users/zain/projects/dsa
python3 -m http.server 8000
# open http://localhost:8000/
```
(A background server was running on port 8791 during this session for verification via
Chrome DevTools MCP — kill/restart as needed in a new session.)
