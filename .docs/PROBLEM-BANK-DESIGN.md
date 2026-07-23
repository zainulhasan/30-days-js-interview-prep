# Problem Bank — Design Spec

Status: **approved by user 2026-07-23, ready for implementation planning.**
Candidate problem list: see `.docs/PROBLEM-BANK-CANDIDATES.md` (71 problems, 19 patterns).

## Purpose

A second, independent problem set for "30 Days of DSA in JavaScript," building on the 30-day
course rather than replacing or extending it. Where the 30-day course teaches one pattern per day
with one worked example, the Problem Bank is a deeper drill: many problems per pattern, each with
multiple solutions (brute force → optimal), so a reader who's already been through the 30-day
course can practice recognition and depth on real, frequently-asked interview questions.

## Non-goals (explicitly out of scope for this spec)

- Does **not** replace or renumber the existing 30-day course. The "30 Days" brand and Day 1-30
  URLs are untouched.
- Does **not** include a system design section — that's a separate, later phase per the user's
  own ordering, not designed here.
- Does **not** attempt to build all 71 problems in one pass — see Build Plan below.

## 1. Site structure & navigation

A new top-level area, `problem-bank/`, parallel to the existing `lessons/` folder.

- **`problem-bank/index.html`** — landing page, grouped by pattern (19 sections: Arrays &
  Hashing, Two Pointers, Sliding Window, Stack, Binary Search, Linked List, Trees, Binary Search
  Tree, Heap, Backtracking, Trie, Graphs, Dynamic Programming 1D, Dynamic Programming 2D, Greedy,
  Intervals, Bit Manipulation, Math & Geometry, Design). Each pattern section lists its problems
  with difficulty and a completion checkmark (mirroring the 30-day homepage's week/day-row
  pattern), plus a short "prereq" note pointing at the relevant 30-day lesson.
- **`index.html`** (existing homepage) gets one new card/section linking into the Problem Bank —
  same visual language as the hero/progress-bar/roadmap already there, not a redesign of the
  homepage itself.
- **Every problem-bank page** gets a "← Problem Bank" nav link in its header (mirroring the
  existing "← All days" pattern on lesson pages), plus a prereq banner (see Page Template below).

## 2. File structure

Flat files, matching the existing `lessons/dayNN.html` convention — no nested folders per
pattern, to avoid URL churn if a problem's primary pattern classification is ever revisited.

```
problem-bank/
  index.html            → landing page, pattern-grouped
  <problem-slug>.html   → one file per problem, e.g. two-city-scheduling.html
js/
  problemBank.js         → data file: problem list + pattern + difficulty + prereq day + slug
                            (same role curriculum.js plays for the 30-day course)
  problemBankProgress.js → localStorage tracker, same shape as progress.js but a separate
                            namespace/key so 30-day completion and problem-bank completion
                            don't collide or double-count
```

`<problem-slug>` uses the LeetCode URL slug directly (e.g. `trapping-rain-water`) so the mapping
between our page and the official problem is unambiguous and greppable.

## 3. Page template (per problem)

Same overall bones as a lesson page — shared `<head>` boilerplate, header/footer, mark-complete
button, `js/engine.js`/`js/problemBankProgress.js` includes — plus:

1. **Prereq banner**, top of page, e.g. "Builds on Day 25: Dynamic Programming I" linking to
   `../lessons/day25.html`. Every problem must have one (derived from its pattern in
   `problemBank.js`); this is what "so people know what they're working on" cashes out to
   structurally, not just visually.
2. **Problem statement** — written in our own words (matching the site's existing practice-problem
   blurb style, not scraped from LeetCode), plus the official LeetCode link and difficulty badge.
3. **Solutions, in order from brute force to optimal** (typically 2, occasionally 3 where a
   genuinely distinct middle approach exists — no padding to hit a fixed count). Each solution is
   a full self-contained section:
   - Short "why this approach" framing (what's naive about it, or what insight unlocks it)
   - A diagram (inline SVG, following the established bug-avoidance rules already documented in
     `.docs/NOTES.md` — the 3 recurring bug classes, the directed-edge-arrowhead fix, etc.)
   - A real, node-verified `DSA.StepPlayer` animation using the existing renderers (`Bars`,
     `Graph`, `Grid`, `CallStack`) — no new engine work required, this reuses the 30-day course's
     infrastructure as-is
   - Real runnable code + line-by-line explanation
   - Complexity (time/space) for that specific approach
4. **Complexity comparison table** — all of that problem's solutions side by side, so the
   brute-force-to-optimal improvement is visible at a glance (this is new relative to the 30-day
   template, which only ever showed one approach's complexity).
5. **Interview corner** — same `.interview-list` pattern and Q&A style as every 30-day lesson
   (bold question, plain-English answer, optional dim "Common follow-up" or "Trap" callout). 2-3
   items per problem: common interviewer follow-ups (how would you extend/modify this?), traps
   (a wrong claim that sounds plausible), and "why not X simpler thing?" questions. This was
   missing from the pilot batch's first pass — the pilot's 3 pages stopped at the complexity table,
   which reads thinner than a 30-day lesson; added retroactively to the pilot and required for
   every problem going forward. No new CSS — `.interview-list` already exists in `css/style.css`.
6. **Quiz** — 5 questions, same `.dsa-quiz` pattern as every lesson, but focused on *why* the
   optimal solution beats the brute force (recognition/reasoning), not just recall.
7. **Mark-complete button**, using `ProblemBankProgress` instead of `DSAProgress`.

## 4. Progress tracking

`js/problemBankProgress.js` mirrors `js/progress.js`'s API (`isDone`, `toggle`, `completedCount`)
against its own `localStorage` key, so a reader's 30-day-course progress and problem-bank progress
are tracked and displayed independently — finishing the problem bank doesn't inflate "You finished
N/30 days," and vice versa. Unlike `progress.js`'s hardcoded `TOTAL_DAYS = 30`, the problem bank's
total is **computed from `problemBank.js`'s data array length at call time**, not hardcoded —
the final problem count is an explicit open decision (see §6), and later batches will keep adding
entries to that data file, so a hardcoded total would silently go stale after the first batch.

## 5. Build plan

"Animate every solution, not just the optimal one" (explicit user decision, overriding my
recommendation to animate only the optimal solution) roughly doubles the authoring effort per
problem relative to the 30-day course, where each lesson had one primary worked animation. Given
that, and given 71 candidate problems total, this ships in **pattern-sized batches**, not as one
71-problem sweep:

- Each batch follows the same pipeline the 30-day course used: parallel **builder** agents (one
  problem per agent, self-contained prompt with the established hard rules — node-verify every
  solution before writing HTML, the 3 recurring bug classes, exact palette hex values, no git, no
  browser testing), then parallel **reviewer** agents per the site's `.docs/REVIEW-CHECKLIST.md`,
  then my own node re-verification + Chrome DevTools MCP browser testing (console errors, every
  solution's animation traced against its own node-verified output, mobile-width overflow,
  quiz/reveal/mark-complete) + fix + commit — identical rigor to every one of the 30 lessons.
- **First batch (pilot, small on purpose)**: Trie (1 problem), Intervals (1), Design (1) — proves
  the full page template, the multi-solution format, and the prereq-link mechanism end-to-end on
  low-volume patterns before committing to a bigger batch.
- **Second batch**: Backtracking (6) — the first real multi-problem, single-pattern batch.
- Subsequent batches proceed pattern by pattern; exact order and whether all 71 get built (vs. a
  trimmed subset) is a standing open decision the user can revisit after seeing the pilot batch —
  not locked in by this spec.

## 6. What this spec does NOT decide yet (deferred to implementation planning / later batches)

- The exact wording/copy for `problemBank.js`'s prereq mapping (which of the 71 problems maps to
  which specific Day N) — will be assigned per-problem as each batch is built, using the pattern
  groupings already in `.docs/PROBLEM-BANK-CANDIDATES.md` as the starting point.
- Whether the final built set is all 71, a trimmed 50-60, or grows further with the user's own
  suggested additions (mentioned but not yet provided) — reconciled before/during each batch, not
  frozen here.
- SEO pass for the new section (meta tags, sitemap.xml addition, structured data) — deferred until
  the Problem Bank has enough real content to be worth it, same reasoning the 30-day course used.
