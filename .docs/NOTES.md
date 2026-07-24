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

## Done — Day 4 lesson (`lessons/day04.html`)
Converging pointers (Two Sum II) + same-direction read/write pointers (Remove Duplicates from
Sorted Array), each with its own diagram + interactive viz. Review pass caught a genuinely
broken code sample (off-by-one in removeDuplicates that silently corrupted array contents —
confirmed with `node`, not just reasoning) that was also duplicated into the practice-problem
solution, plus a mislabeled difficulty (Two Sum II is Medium not Easy) and more diagram/dry-run
target-value mismatches (caught one myself before browser-testing, review agent caught another).
Fixed and re-verified, including re-running the corrected code through `node` on multiple test
cases before trusting it.

## WEEK 1 COMPLETE (Days 1-7)
All 7 lessons built, node-verified where they contain runnable algorithms, browser-tested
(console errors, animations, quiz, reveals, mark-complete, mobile width), and independently
reviewed via `.docs/REVIEW-CHECKLIST.md` with fixes applied. Day 5 (Sliding Window), Day 6
(Hash Maps & Sets), Day 7 (Week 1 Review) built after Day 4; summaries:
- **Day 5**: fixed/variable sliding window. Review caught a diagram caption with a wrong traced
  result and a complexity-table space claim that contradicted the lesson's own practice-problem
  solution (same O(k)-overreach class as Day 4/6).
- **Day 6**: hash maps/sets, frequency counting. Caught two bugs myself pre-review (map display
  breaking Map's own insertion-order guarantee via a plain-object round-trip; a narration/
  display timing mismatch) — this "catch it myself first" habit is now working. Review caught a
  legend not matching actual visualization colors, and another O(k)-overreach in the complexity
  table.
- **Day 7**: Week 1 review day — 5 mixed practice problems (not 3, per the original spec for
  review days), a Week 1 code-template cheat sheet, a pattern decision-checklist diagram, and a
  synthesis visualization (Subarray Sum Equals K) combining sliding-window + hash-map ideas.
  Rebuilt the flowchart diagram from a branching tree to a stacked linear layout after the tree
  caused text overlap/clipping — noting this as a **general diagram-design rule**: prefer
  stacked/linear layouts over branching trees in a 620px-wide SVG; trees run out of horizontal
  room fast. Review caught a missing required section (the "how to talk through it out loud"
  paragraph — every lesson needs one, review-day structure exceptions don't cover skipping it).

**New standing practice, working well, keep doing it:** any lesson with a real, runnable code
solution should be executed via `node -e` against known test cases before browser-testing, not
just visually inspected — this has caught real bugs (Day 4's off-by-one) and given fast
confidence on Days 5-7. Also keep self-checking for the recurring bug classes before dispatching
review (cross-section value mismatches, SVG text clipping, legend/state mismatches) — doing so
has caught real issues before the review agent even runs, which is faster than waiting for review.

## Done — Days 8-9 (Week 2 started)
- **Day 8** (Bubble/Selection/Insertion Sort): 3 animated sorts using DSA.Bars directly + a
  signature-comparison diagram. Review caught a real complexity-table contradiction (claimed
  bubble sort O(n) best case, but the shown code had no early-exit — fixed by adding the
  standard swapped-flag optimization to both code and animation, not by weakening the claim)
  and an off-by-one in the insertion-sort narration.
- **Day 9** (Recursion & Call Stack): first real use of the `CallStack` engine renderer
  (factorial + recursive string-reverse). Caught a real bug myself pre-review: a pop loop bound
  to `stackVals.length` while mutating that same array mid-loop — terminated early, same bug
  class as Day 3's own lesson content. Review caught the static diagram drawing the stack
  upside-down vs. how `CallStack.render()` actually displays it (newest call renders on top,
  confirmed from engine.js `frames.slice().reverse()`) — worth remembering for any FUTURE
  diagram depicting a stack: newest/most-recent on top, always. Added the missing `.lg-active`
  legend CSS class (state existed in engine.js, no swatch existed).

## Done — Day 10 (Merge Sort)
Full split+merge animation (instrumented recursive step builder over DSA.Bars) + recursion-tree
diagram. Practice problem 3 is intentionally Hard (Merge k Sorted Lists), not the usual
easy→medium arc — it's the natural extension of today's topic, honestly labeled as a Day-15
(linked lists) preview with an array-based sketch instead of a real submission. Noting this here
as the approved exception (mirrors Day 7's "5 problems" exception). Review caught a real bug:
merge narration said "X is smaller" unconditionally, including on ties, which directly
contradicted the lesson's own stability teaching whenever Shuffle produced a duplicate — fixed
with explicit tie-case wording. Also fixed a legend promising an unused blue state while green
was overloaded to mean two different things.

## Done — Day 8 split into 3 pages + sitewide theme pivot
User asked for multi-topic days to be split into small focused sub-pages rather than one big
page. Day 8 (bubble/selection/insertion sort — the clearest offender, 3 genuinely distinct named
algorithms) was split into `day08.html` (Bubble, part 1/3), `day08b.html` (Selection, part 2/3,
new practice problems), `day08c.html` (Insertion, part 3/3, carries the sole "Mark Day 8
complete" button since progress is tracked per-day not per-part). `day07.html`/`day09.html` nav
links updated. **Standing rule going forward** (see also DECISIONS.md): split any future day
that bundles 3+ genuinely distinct, individually-nameable algorithms into sub-pages the same
way; a pattern-with-multiple-shapes (two-pointer, sliding window, recursion examples, hash-map
examples) is NOT the same thing and should stay one lesson — only split on real "algorithm X vs
algorithm Y vs algorithm Z" bundling.

Separately, the user supplied a full replacement design spec: dark theme → warm light/cream
theme (exact palette in DECISIONS.md §2.5). This is a **full sitewide pivot**, not additive —
`css/style.css`'s `:root` was rewritten, and every already-built lesson's hand-drawn SVG
diagrams needed a sitewide hex find-replace (they hardcode colors, don't read CSS vars).
Verified safe first (small closed palette, checked via grep before touching anything), executed
via `sd`, verified in-browser afterward across every renderer type (Bars, the Day 2 chart, the
Day 9 CallStack, Graph-style tree diagrams) with no console errors and good contrast throughout.
**Full details, exact hex mapping, and the still-open font-vendoring question are in
DECISIONS.md §2.5 — read that before starting Day 11**, since every new lesson must be authored
directly in the new palette from here on (the old dark-theme hex values must not be reused).

## Done — Day 11 (Quick Sort)
Full recursive partition+recurse animation (instrumented Lomuto-partition step builder over
DSA.Bars) + a before/after partition diagram (`[5,2,8,1,3]` around pivot `3`). Algorithm
node-verified before writing HTML. Review caught 3 must-fix issues, all applied: (1) the
diagram's "after" boxes had two values transposed (showed `[2,1,3,8,5]`, should be `[2,1,3,5,8]`
— pure copy/paste box-label error, didn't match the lesson's own dry-run table or the real
`partition()` output) — fixed by swapping the two `<text>` labels; (2) all 3 practice problems
were Medium (no easy→medium arc) — fixed by replacing problem 1 with **Partition Array According
to Given Pivot** (Easy, LeetCode 2161) which is also a near-perfect thematic tie-in (a stable
three-way partition, contrasted with today's in-place unstable one); (3) problem 3 ("Sort
Colors") was a silent duplicate of a Day 8 practice problem — fixed by replacing it with **3Sum**
(Medium), which also nicely calls back to Day 4's two-pointer technique. Also independently
caught (before review) that problem 1 as originally written ("Sort an Array") duplicated Day 10's
problem 2 — resolved by the same swap. **New duplicate-avoidance note:** cross-check every new
practice problem against the full list in this file's day-by-day summaries before finalizing —
duplicates aren't always caught by the reviewer (it missed the Day 10 one), so do this check
myself first, same discipline as the "catch bugs before review" habit above. Verified in-browser
after fixes: zero console errors at both 390px and 1280px, full 18-step animation plays correctly
through nested recursive partitions, quiz feedback and mark-complete both work.

**Practice problems used so far, Day 11 final:** Partition Array According to Given Pivot (Easy),
Kth Largest Element in an Array (Medium, explicit Day 8b callback), 3Sum (Medium, explicit Day 4
callback).

## Done — Days 14, 15, 17, 18 (first parallel-agent batch)
User asked to speed up via parallelism. Dispatched 4 `general-purpose` Agent calls in parallel
(Day 14 Week 2 Review, Day 15 Linked Lists, Day 17 Stacks, Day 18 Queues & Deques — Day 16 held
back since it depends on Day 15's actual Node/LinkedList implementation), each with a fully
self-contained prompt (see "Parallel build approach" entry above). All 4 came back with real,
node-verified algorithms and no must-fix structural gaps, but browser-testing surfaced several
real bugs — parallelism sped up first-draft writing, but every lesson still needed the full
manual verification pass, exactly as expected:

- **Day 15 exposed two genuine SHARED bugs in `js/engine.js`/`css/style.css`**, not lesson-specific
  — it's the first-ever real usage of `DSA.Graph` (defined since the foundation build, never
  exercised until now): (1) the Graph's SVG had no definite container width, so it silently fell
  back to the browser's 300×150 intrinsic default instead of filling its panel (fixed: constructor
  now does `this.container.classList.add('dsa-graph-wrap')`, paired with a new `.dsa-graph-wrap {
  width: 100% }` rule); (2) the shared state-color classes (`dsa-active`, `dsa-pointer`, etc.) only
  ever set CSS `background`, which has zero effect on an SVG `<circle>` — so every graph node
  silently rendered in neutral gray regardless of its actual state, defeating the whole point of
  the color-coded animation. Fixed with explicit `fill` overrides per `.dsa-node-circle.dsa-<state>`
  plus `~ .dsa-node-text` sibling-selector rules for text contrast. **Both fixes are now permanent
  for every future Graph-based lesson (trees, BSTs, graphs, Days 19-24)** — verify Graph nodes
  actually change color and the SVG fills its panel the first time you build one of those, as a
  sanity check that this fix is still in place.
- **Recurring bug, now seen 3 times across this batch: an unbroken slash-or-hyphen-joined token
  inside a table cell forces that column wider than its container, overflowing at 390px mobile
  width** even though the rest of the page is fine (Day 17: "Min Stack (push/pop/top/getMin)";
  Day 14: "Binary Search — boundary/search-on-answer (Day 13)"). Fix is always the same: add a
  space around the slash/hyphen so the browser can wrap there. **Standing rule: after building any
  table, grep the cell contents for a token 15+ characters with no space, especially in an
  "Approach"/"Algorithm" first column** — this is now a known site-wide risk class, not
  a one-off.
- **Recurring bug, now seen 3 times: an SVG `<text>` line that's individually short enough to fit
  the viewBox width can still visually overlap an ADJACENT text element** if they're both
  positioned at the same y-coordinate too close together horizontally (Day 15: two "Trap:" lines
  clipped at the viewBox's right edge; Day 18: two labels — "front = ..." / "back = ..." — each
  fit their own width but overlapped each other in the middle). The original "keep lines short"
  rule isn't sufficient by itself — also check horizontal spacing between side-by-side text
  elements at the same y, not just each line's own length against the viewBox.
- **A real, pre-existing prose/code mismatch in Day 13 was caught by Day 14's review agent**
  (comparing Day 14's cheat sheet against Day 13's actual code) and fixed at the source: Day 13's
  goal list and interview corner claimed BOTH binary-search variants (first/last occurrence AND
  search-on-answer) use a `while (lo < hi)` loop, but `findBound()`'s actual code uses `lo <= hi`
  (it still checks for an exact match, just doesn't return immediately — only Sqrt(x)/Koko's
  genuinely different search-on-answer template uses `lo < hi`). Rewrote the prose to correctly
  distinguish the two template shapes instead of conflating them. Day 14's own quiz Q3 (which had
  copied the same false claim) was fixed to match. **Lesson: a downstream review agent comparing
  one day's summary against an earlier day's actual code is a good way to catch bugs the earlier
  day's own review missed** — the earlier lesson's own review didn't cross-check its prose against
  its own code closely enough.
- **Found and fixed a real, unrelated sitewide bug while starting this batch**: the favicon hex
  fix from the original One Dark Pro theme correction (`.docs/DECISIONS.md` §2.5) was never
  actually applied — the percent-encoded favicon accent color was still the old approximate blue
  (`%2361AFEF`) in all 12 pre-Day-11 pages. Fixed with one `sd` pass; see the dedicated NOTES.md
  entry above for detail. Also added `.gitignore` (`.claude/`, `.playwright-mcp/`, `.DS_Store`) —
  local tool-session artifacts had been showing up as untracked files.
- Day 17 review (must-fix: none) found 2 worthwhile nice-to-haves, both applied: a "peek() vs
  top()" terminology bridge (Min Stack's real LeetCode API uses `top()`; goal list only ever said
  `peek()`), and a diagram caption that overclaimed what the literal next character in the traced
  string would be.
- Day 15 review found 2 must-fix items, both applied: (1) Concept section was missing the
  required real-life analogy (every other new-topic lesson has one) — added a scavenger-hunt
  analogy (each clue only tells you where the next one is, no shortcut to clue #4); (2) Graph node
  text was shrinking below legibility on narrow mobile viewports — the fixed viewBox scales
  uniformly with its container, so a 720-unit-wide graph squeezed into a ~330px mobile panel made
  every label ~5-6px tall. **Fixed centrally in `js/engine.js`'s `Graph` constructor** (not
  per-lesson): `this.svg.style.minWidth = width + 'px'` keeps the SVG at its natural size, paired
  with `.dsa-graph-wrap { overflow-x: auto }` so mobile scrolls horizontally instead of shrinking
  text — the same pattern already used sitewide for wide tables and `pre` code blocks. This is now
  permanent for every future Graph-based lesson, same as the width/color fixes above — three
  Graph-renderer fixes total from this one lesson being the first real usage.
- Day 18 review dispatched, pending as of this note.

## ALL 30 LESSONS COMPLETE
Days 1-30 are all built, node-verified, browser-tested, and committed. See the per-batch "Done"
entries throughout this file for what each day covers and what bugs were found/fixed along the
way. Nothing left in the core curriculum — remaining work is the deferred SEO pass below, plus
whatever polish/follow-up the user asks for next.
- **Open decision, not yet actioned:** whether to vendor the actual JetBrains Mono font file
  (self-hosted, OFL-licensed, offline-safe) so headings/code render in true JetBrains Mono
  instead of falling back to a system monospace font. Asked the user; awaiting their answer.
- **SEO pass — user explicitly requested, do once all 30 lessons are built and verified** (not
  piecemeal per-lesson): proper per-page `<title>`/heading structure (already have unique titles
  per lesson, worth auditing for consistency/keyword quality once the full set exists), meta
  description quality pass, Core Web Vitals check (the site should already be fast — static
  HTML/CSS/vanilla JS, no heavy JS frameworks — but verify with Lighthouse once index.html + all
  30 lessons are final), structured data (e.g. Course/LearningResource or BreadcrumbList JSON-LD
  — check what schema.org type fits an educational course site), `sitemap.xml` + `robots.txt`
  (neither exists yet), and Google Search Console submission/indexing once the custom domain
  (`dsa.itszain.tech`, see the CNAME entry above) is confirmed live. This is a full task on its
  own, not a few line-edits — plan a dedicated pass, don't bolt it onto the remaining lesson
  builds.
- GitHub Pages: user added a `CNAME` file directly on GitHub (commit `fb02ed3`, outside this
  session) pointing at custom domain `dsa.itszain.tech` — discovered via a rejected `git push`
  (remote had commits this session didn't make), resolved with `git pull --rebase`. Suggests the
  user is setting up (or has set up) Pages hosting themselves; haven't independently confirmed the
  domain is live/serving. **Lesson: a push can be rejected by legitimate user activity on GitHub
  itself, not just other agent sessions — always `git fetch`/inspect what's actually on the remote
  before assuming a rejected push means another session collided, and never force-push over it.**

## Done — theme pivoted again: now "One Dark Pro" (VS Code theme), colors extracted to tokens.css
The light/cream theme (previous entry above) was superseded in the same session — user wanted
the exact color scheme of the popular VS Code **One Dark Pro** theme instead. Full details,
exact hex sourcing (pulled from the real theme repo via `gh api`/`curl`, not memory), and the
repeatable sitewide-recolor process are in **`.docs/DECISIONS.md` §2.5 — read that before
touching colors again.** Short version: colors now live in `css/tokens.css` (new file,
`style.css` pulls it in via `@import`), and every lesson's inline SVG diagrams were sitewide
find-replaced (twice — once to light, once to One Dark Pro) since they hardcode hex rather than
reading CSS variables. Verified in-browser across every renderer (Bars, Day 2's chart, Day 9's
CallStack, Day 10's tree diagram) with hard reloads, no console errors, good contrast throughout.
**Every lesson from Day 11 onward must be authored directly in the `tokens.css` palette.**

## Found + fixed — stale favicon color sitewide (missed by the earlier theme correction)
While starting Day 12, noticed `lessons/day10.html`'s favicon still used the old approximated
blue (`%2361AFEF`) instead of the corrected exact One Dark Pro blue (`%2361AEEE`) — the
"hex precision drift" fix documented in DECISIONS.md §2.5 corrected plain `#hex` usages sitewide
but its separate percent-encoded favicon pass was never actually run. Checked every file: all 12
pre-Day-11 pages (`index.html`, `day01`–`day10`, `day08b`, `day08c`) had the stale favicon; only
`day11.html` (built after the correction) had it right. Fixed with one `sd -s "%2361AFEF"
"%2361AEEE"` pass across `lessons/*.html index.html` (only one hex mapping needed — favicons only
ever use the background + accent colors) and verified via grep that no stale value remains
anywhere. **Lesson for any future palette change: always grep specifically for `%23` + old hex
after the "sitewide fix," don't just trust that the documented process ran — it silently didn't
here.**

## Done — Day 12 (Binary Search) and Day 13 (Binary Search Variations)
- **Day 12**: classic iterative template (`lo <= hi`, `hi = mid - 1`/`lo = mid + 1`), verified via
  node against multiple cases. Two diagrams: one tracing a live search, one specifically
  illustrating the `lo = mid` (without ceiling) infinite-loop trap that recurs in "search on
  answer" templates — this second diagram sets up Day 13's Sqrt(x) practice problem directly.
  Practice problems: Binary Search, Search in Rotated Sorted Array, Find Peak Element (the last
  one deliberately non-sorted-array, to teach "monotonic predicate" over "sorted array" as the
  real requirement).
- **Day 13**: first/last occurrence (two independent narrowing searches sharing one
  `findBound(isFirst)` helper) and search-on-answer (Koko Eating Bananas), both verified via node.
  Practice problems: Sqrt(x) (ties back to Day 12's infinite-loop trap diagram via its ceiling-mid
  fix), Find First and Last Position of Element in Sorted Array, Koko Eating Bananas. One diagram
  needed a text-clipping fix mid-build (a box's text was exactly as wide as the box — shortened
  the wording rather than widening the box, simpler fix for this recurring bug class).
  Both lessons verified in-browser (390px + 1280px, zero console errors, full animation
  step-through matches node output exactly, quiz/reveal/mark-complete all work).

## Parallel build approach adopted for Days 14+ (user asked to speed up via parallelism)
Starting Day 14, dispatched multiple `general-purpose` Agent tool calls in parallel (not the
heavier Workflow tool — user asked to "build in parallel," which the Agent tool already supports
without needing full workflow orchestration) to draft several lessons simultaneously instead of
one at a time. Each agent gets a fully self-contained prompt: project context, required page
structure, hard rules (node-verify all real algorithm code before writing it, SVG text-wrapping
caveat, exact tokens.css hex values, exact favicon/boilerplate markup, the full cross-lesson
practice-problem duplicate-avoidance list compiled from every prior day, no unauthorized file
changes, no git operations, no browser testing — that stays with me), plus day-specific topic
guidance and reserved-topic warnings for adjacent days (e.g. Day 15's agent was told to leave
list-reversal and fast/slow-pointer problems for Day 16). Agents only WRITE the lesson file —
node-verification of their own algorithm claims is on them, but browser-testing, the content-
advisor review pass, fixing review findings, committing, and updating this file all stay with me
afterward, same rigor as every solo-built lesson so far. First parallel batch: Day 14 (Week 2
Review), Day 15 (Linked Lists), Day 17 (Stacks), Day 18 (Queues & Deques) — Day 16 deliberately
held back until Day 15 lands, since it builds directly on Day 15's Node/LinkedList class and
needs to see the actual implementation for consistency, not just the topic description.
**Standing process note:** every agent-drafted lesson still needs the full same verification I've
been doing solo (browser console/animation/quiz/mobile checks, content-advisor review, fix,
commit) — parallelism speeds up first-draft writing, not the verification gate.

## Done — Days 16, 19, 20, 22, 23, 24 (Linked Lists II through Graphs II)
- **Day 16** (Linked Lists II — Fast/Slow & Reverse): built solo, since it needed Day 15's real
  `Node`/`LinkedList` class for consistency. `reverseList`, `middleNode`, `hasCycle` (Floyd's),
  `reorderList`. Self-caught an off-canvas NULL-label bug and an overlapping arrow/label before
  review; review caught a narration/visual contradiction in the fast/slow middle-finding
  animation (a marker rendered on a valid node while narration said "past the end" for
  even-length arrays) — fixed by passing the raw out-of-bounds index through instead of clamping
  it for display.
- **Day 19** (Trees — BFS & DFS): agent-built. `TreeNode`, `bfs` (queue), `dfs` (stack,
  push-right-then-left for preorder). Fixed two un-wrapped wide dry-run tables and an illegal
  quiz example that violated the lesson's own max-2-children binary-tree definition.
- **Day 20** (Binary Search Trees): agent-built. `insert`/`search`/`isValidBST` (min/max-bound).
  Independently node-verified the "locally-fine-but-globally-invalid" trap by writing a
  deliberately-wrong local-only validator alongside the real one and confirming they diverge on
  the trap tree. Fixed overlapping left/right-subtree caption text in one diagram.
- **Day 22** (Heaps & Priority Queues): agent-built. `MinHeap` with `insert`/`bubbleUp`/
  `extractMin`/`bubbleDown`. Node-verified with a heap-invariant checker after every operation
  plus a 30-value fuzz test. Zero bugs found in browser-testing or review — cleanest build of
  the batch.
- **Day 23** (Graphs — BFS & DFS): agent-built. Adjacency-list `bfs`/`dfs` on a 7-node graph with
  one 4-cycle. Node-verified traversal orders, cycle termination, and `cloneGraph`'s cycle-safe
  deep copy. Fixed one un-wrapped complexity table.
- **Day 24** (Graphs II — Shortest Path & Topo Sort): built solo. `bfsShortestPath` (BFS +
  distance map) and `topoSortKahn` (Kahn's algorithm), reusing Day 23's exact graph for the BFS
  half. Node-verified both algorithms plus `findJudge`/`canFinish`/`updateMatrix` against their
  LeetCode semantics. Fixed a clipped caption line in the "why a cycle blocks topo sort" diagram
  (text ran past the viewBox — same recurring bug class, split into two lines + taller viewBox).

## Found + fixed — directed-edge arrowheads were invisible in every `DSA.Graph` animation
While browser-testing Day 24's Kahn's-algorithm visualization, noticed directed edges (parent→
child, next-pointer, prerequisite→dependent) rendered with no visible arrowhead at all, despite
`marker-end` being set correctly. Root cause: the edge `<line>` ran all the way to the target
node's *center*, and the `<marker>` (which paints right at the line's endpoint) landed dead
inside the node `<circle>` — which is drawn *after* edges in the same `render()` pass and so
paints over it completely. This silently affected every directed graph on the site since Day 15
first used `DSA.Graph` — Days 15, 16, 19, 20, and 24 all lost their directional cue without
anyone (agent or reviewer) noticing, because the *shape* of the traversal still looked plausible
without arrows. Fixed centrally in `js/engine.js`'s `Graph.render()`: for `directed: true` edges,
the line's endpoint is now pulled back along the edge vector by the node radius (18) before the
marker is attached, so the arrowhead renders just outside the node's rim instead of underneath
it. Verified the fix on Day 24 (now-visible arrows on the Kahn's-algorithm graph) and spot-
checked Day 19's tree diagram — arrows now correctly point parent→child with no layout
regression. This is a good example of the "diagram looks right on skim, but a specific visual
element is silently missing" failure mode — worth explicitly checking marker/arrow visibility,
not just overlap/clipping, in future Graph-based lesson reviews.

## Done — Day 25 (Dynamic Programming I)
Built solo. `fibNaive`/`fibMemo`/`fibTab`/`fibOptimal` (four progressively-optimized versions of
the same recurrence) plus `climbStairs`. Node-verified all four fib variants agree for n=0..15,
and independently counted recursive calls to confirm the exact numbers quoted in the lesson text
(fib(4): 9 naive vs. 7 memoized; fib(10): 177 vs. 19; fib(30): 2,692,537 vs. 59 — not just cited
Big-O, the actual counts). Also verified `minCostClimbingStairs` and `uniquePaths` against their
known LeetCode examples. Fixed one real bug: the "filling a DP table" diagram's two curved
"pulls from" arrows peaked at a height that visually crossed directly through the `dp[6]` column
label — confirmed via the quadratic-Bezier math that the curve passes within ~1px of the label's
baseline near its start — fixed by moving the label row up for clearance, same recurring
"element overlaps an adjacent element" bug class as before, just arc-vs-label instead of
text-vs-text this time.

## Done — Day 21 (Week 3 Review)
Built solo, following the Day 7/14 review-day template (decision-checklist diagram, one synthesis
visualization, cheat sheet, complexity table, interview corner, 5 mixed practice problems, quiz).
Synthesizes Days 15-20 around one question: what access pattern (LIFO, FIFO, pointer-chain,
level-order, sorted-order) does the problem actually need. The synthesis visualization validates
a BST via **iterative inorder traversal with an explicit stack** instead of Day 20's recursive
min/max bounds — reuses Day 20's exact base-tree layout/positions for visual continuity, plus a
second "corrupted" variant (one node's value swapped to reproduce Day 20's locally-fine-but-
globally-invalid trap) that Shuffle toggles to, showing the stack-based approach correctly
detecting the same violation Day 20's bounds-tracking caught. Node-verified the traversal against
both the valid tree (pop order 20/30/40/50/60/70/80) and the corrupted one (stops at 35 right
after 50, matching Day 20's trap). Also node-verified all 5 mixed practice problems (Palindrome
Linked List, Implement Stack using Queues — the mirror of Day 18's problem 1 — Kth Smallest
Element in a BST, Binary Tree Zigzag Level Order Traversal, Lowest Common Ancestor of a BST)
against known examples before writing them up. Browser-tested clean: zero console errors, both
animation branches (valid/invalid) matched their node-verified traces exactly, directional arrows
rendered correctly on the tree (confirming the earlier arrowhead fix holds up), zero mobile
overflow, quiz/reveal/mark-complete all work. No bugs found — first review-day build with a clean
pass on the first try.

## Done — Days 26-27 (second parallel-agent batch, Week 4 continues)
Dispatched two `general-purpose` agents in parallel again (same pattern as the Day 14/15/17/18
batch): Day 26 (Dynamic Programming II) and Day 27 (Greedy Algorithms) don't depend on each other,
just on Day 25 being done, so they built simultaneously.
- **Day 26** (DP II — House Robber + Coin Change): two new recurrence shapes beyond Day 25's
  fibonacci sum — House Robber's max-of-2-choices (`dp[i] = max(dp[i-1], dp[i-2]+nums[i])`) and
  Coin Change's unbounded inner-loop min (`dp[amt] = min(dp[amt-c]+1)` over every coin). Practice:
  House Robber, Coin Change (both doubling as formal citations of the worked examples, same
  pattern as Day 25's Climbing Stairs), Longest Increasing Subsequence. Node-verified every
  algorithm and every worked-example number before/after the agent wrote them (houseRobber
  ([2,7,9,3,1])=12, coinChange([1,2,5],11)=3 with the full dp array cross-checked cell by cell
  against the dry-run table, coinChange([1,3,4],6)=2 confirming the greedy-fails foreshadowing of
  Day 27). Browser-tested clean — zero bugs found, matching the agent's own hand-traced
  self-report exactly.
- **Day 27** (Greedy Algorithms): Non-overlapping Intervals as the canonical "greedy provably
  works" example (sort by end time — the why is the whole lesson), plus a genuine worked
  counter-example (coins [1,3,4], amount 6: greedy picks 4+1+1=3 coins, optimal is 3+3=2 coins)
  showing greedy failing on the exact problem Day 26 solved correctly with DP — a deliberate
  cross-day callback. Custom interval-bar visualization (not `DSA.Bars`, which doesn't fit
  horizontal spans) driven by the same `DSA.StepPlayer` engine, using percentage-based absolute
  positioning so it scales cleanly at any width without a scroll wrapper — a new, reusable pattern
  for future interval-style problems. Practice: Best Time to Buy and Sell Stock II, Non-overlapping
  Intervals, Jump Game. Node-verified every algorithm (erase/greedyCoinChange/maxProfit/canJump)
  against known cases. **Fixed one bug**: the interval-scheduling diagram's "kept"/"removed" legend
  was laid out side-by-side and the "kept" label's text ran wider than the gap before the next
  swatch, overlapping it — same recurring "adjacent same-row text collision" bug class as before;
  fixed by stacking the two legend rows vertically instead of guessing at horizontal spacing.

## Done — Day 28 (Pattern Recognition Masterclass)
Built solo (needs full-curriculum awareness across all 27 prior days, not a fit for the parallel-
agent pattern). A meta-lesson, not a new-algorithm lesson: master dispatch flowchart (6 rows, same
proven geometry as Day 7/14/21's diagrams) that routes to Day 7/14/21's existing sub-flowcharts
for Weeks 1-3, plus new dispatch rows for the Week 4 topics that never got a review day (Heap,
Graph, DP-vs-Greedy). A signal-words reference table (problem phrasing → pattern → day) replaces
what would otherwise be a second risky SVG diagram. The "interactive visualization" slot is
repurposed as an 8-question pattern-recognition drill built from the existing `.dsa-quiz`/
`DSA.wireQuiz` machinery (no new JS needed) — genuinely interactive, on-topic for a meta lesson,
and zero new bug surface. "The code" section is a combined reference cheat sheet (one skeleton per
pattern) instead of a single new algorithm. Practice problems chosen specifically to test
recognition over rote keyword-matching: Product of Array Except Self (the word "array" doesn't
mean hash map here), 3Sum Closest (same shape as Day 11's 3Sum, different termination), Word
Search (DFS/backtracking on a grid never labeled a "graph"). Node-verified all 3 solutions plus
the worked recognition example (`canFormPalindrome`, using the "at most one odd-count character"
palindrome-rearrangement rule) before writing them into the lesson. Browser-tested clean — zero
console errors, zero mobile overflow, all 13 quiz blocks (8 drill + 5 formal) verified working,
mark-complete and reveal panels confirmed, diagram screenshot showed no overlap/clipping. No bugs
found.

## Done — Day 29 (Mock Interview Day)
Built solo. First lesson with a genuinely new interactive primitive: a self-contained countdown-
timer widget (`createTimer()` factory — Start/Pause/Reset, double-start guarded, independent
per-problem instances) built inline in the page rather than added to `js/engine.js`, since it's a
one-off UI pattern rather than a reusable visualizer. 4 timed Medium problems chosen to span
different pattern categories and NOT reuse any prior day's problem: Longest Palindromic Substring
(expand-around-center), Merge Intervals (sort + linear pass — distinct mechanic from Day 27's
Non-overlapping Intervals despite the shared "intervals" theme), Rotting Oranges (multi-source
BFS, same family as Day 24's 01 Matrix), and Longest Common Subsequence (the course's first 2D DP
table). Node-verified all 4 solutions against known LeetCode examples before writing them up. A
time-budget diagram (2/3/5/10/5-minute phase breakdown of a 25-minute problem) plus an
interview-strategy quiz (not an algorithm quiz — how to use extra time, what to do when the timer
runs out, etc.) round out the lesson. **Fixed one bug**: the diagram's closing caption line ran
past the viewBox's right edge and got visually clipped — same recurring "SVG text exceeds viewBox
width" bug class as several earlier lessons — fixed by splitting it across two lines and growing
the viewBox height to fit. Browser-tested the timer directly (Start decrements correctly over a
real ~2.5s wait, Pause halts it, Reset restores the initial value, double-clicking Start doesn't
double the countdown speed, and all 4 timers run independently) — zero console errors, zero mobile
overflow, quiz/reveal/mark-complete all confirmed working.

## Done — Day 30 (Final Review & Cheat Sheet) — COURSE COMPLETE
Built solo. The capstone: a single 30-row master cheat sheet (Algorithm/Day/Time/Space/Trigger)
compiled from every day's already-established complexity data — no new complexity claims, all
cross-checked against what each individual lesson already stated to avoid contradicting earlier
pages. A practical interview-day checklist (night before / morning of / during each problem /
after each problem) — logistics and mindset, deliberately not more algorithms, since Days 28-29
already covered recognition and timed practice. New capstone-only feature: a live "your progress"
panel that reads `DSAProgress.completedCount()`/`isDone()` directly from the site's own
localStorage tracker (previously only shown on `index.html`) and lists which specific days aren't
marked complete yet — genuinely interactive and unique to this final page, confirmed in-browser to
update immediately when a day is (un)marked. The "30-day arc" diagram reuses the horizontal-bar
+ legend pattern proven twice now (Day 27's interval viz, Day 29's time-budget diagram) rather
than inventing a new geometry. No new practice problems — deliberately, since Day 29 just gave 4
and Day 30's job is compaction, not more solving. Nav's "next" link points back to
`../index.html` ("🎉 Back to course overview") since there is no Day 31. Browser-tested clean:
zero console errors, zero mobile overflow (including the 5-column, 30-row cheat sheet table via
its `overflow-x:auto` wrapper), progress panel verified against real localStorage state (showed
7/30 accurately reflecting every day marked complete during this session's testing, updated live
to 8/30 the moment Day 30 itself was marked), quiz/mark-complete all confirmed working.

**All 30 lessons are now built, verified, and committed.** This closes out the core curriculum
build. Remaining open item: the SEO pass explicitly deferred by the user until all lessons were
done (see the entry above — title/heading audit, meta descriptions, Core Web Vitals, structured
data, sitemap.xml, robots.txt, GSC submission).

## Done — SEO pass (the task deferred until all 30 lessons were complete)
- **Meta descriptions**: audited every page's length (many were either <120 or >165 chars once
  measured correctly — first audit pass had a script bug that included the `name="description"
  content="` prefix in the char count, inflating every number by ~29; re-audited properly).
  Rewrote 23 pages' descriptions into the ~127-154 char sweet spot.
- **Titles**: shortened 3 lesson titles that ran past ~60 chars (Day 16, 24, 28) by dropping the
  extended subtitle, keeping the curriculum's core title.
- **Canonical + Open Graph + Twitter Card tags**: added to all 33 pages (index + 32 lessons),
  pointing at the custom domain `https://dsa.itszain.tech/`.
- **Structured data**: `Course` JSON-LD on `index.html` (generated from `js/curriculum.js` so it
  can't drift from the real roadmap — `hasPart` lists all 30 days with name/url/position) plus
  `BreadcrumbList` JSON-LD on every lesson page (Home > Day N).
- **sitemap.xml** (33 URLs) and **robots.txt** (allow all, points at the sitemap) — both new files
  at the repo root.
- **Lighthouse**: ran a real audit (mobile, navigation mode) — SEO 100, Best Practices 100,
  Agentic Browsing 100, Accessibility 95 (one real WCAG AA contrast failure: the theme's
  `--text-dim` only hit 3.9:1 against the dark backgrounds, below the 4.5:1 minimum — fixed by
  lightening it, see the typography entry below; Accessibility is 100 now).
- **Not done — needs the user's own access**: Google Search Console submission (requires the
  user's own GSC account / domain verification). Sitemap is ready to submit once GSC is set up.
- **Known, not chased further**: Lighthouse also flagged CLS ≈0.13 ("needs improvement," not
  "poor") on `index.html`, most likely from the JS-rendered roadmap list populating an initially-
  empty `#roadmap` div after first paint. Not fixed this session — noted here in case it's worth
  a `min-height` placeholder later.

## Done — typography, code-block, and homepage redesign (user-directed, with reference images)
- **Typography**: h1 32px/700, h2 24px, body text 16px/24px line-height, body text color lightened
  to `#e2e3e7` (was `#ABB2BF`) — all via `css/tokens.css`/`css/style.css` so it cascades everywhere
  with no per-lesson changes needed.
- **Code blocks**: rewrote `js/engine.js`'s syntax highlighter from "one big highlighted string"
  to a line-by-line tokenizer (`highlightLines`) that builds a real line-numbered, horizontally-
  scrollable card (`buildCodeBlock`) with a copy-to-clipboard button. The button tries
  `navigator.clipboard` first and falls back to `document.execCommand('copy')` for `file://`
  contexts, where the Clipboard API has no secure context — this site must still work opened
  directly, so the fallback isn't optional. Also disabled font ligatures site-wide
  (`font-variant-ligatures: none`) after noticing `<=` was rendering as a single merged `≤`-style
  glyph in some monospace fonts — bad for a teaching site where exact characters matter.
- **Homepage roadmap**: replaced the flat card-row day list with a connected vertical timeline
  (numbered circle badges linked by a line, larger titles, an icon+blurb meta line, a circular
  chevron/checkmark on the right) matching a reference screenshot the user provided. Whole-row
  click-to-navigate behavior unchanged.
- **Found + fixed a real regression from the typography change**: SVG diagrams hardcode hex colors
  directly (established project convention — SVG doesn't reliably inherit CSS custom properties),
  so changing `--text`/`--text-dim` in tokens.css only updated HTML text, leaving every diagram's
  dim/label text on the old grays — a visible mismatch the user caught by eye. Fixed with a
  sitewide `sd` replacement (`#818896`→`#9198A6`, `#ABB2BF`→`#E2E3E7`) across 22 files. **Lesson for
  next time a token color changes: grep for the old hex across `lessons/*.html` immediately, don't
  assume the CSS var change is sufficient** — this is the same "sitewide fix silently didn't reach
  everywhere" failure mode as the stale-favicon incident earlier in the project, just with diagram
  colors instead of favicons.

## Done — Problem Bank pilot batch (new feature, separate from the 30-day course)
- **What it is**: a second, independent problem set — `problem-bank/` (parallel to `lessons/`) —
  for readers who've finished the 30-day course and want more reps on real interview questions.
  Full design/candidate-research docs: `.docs/PROBLEM-BANK-DESIGN.md`,
  `.docs/PROBLEM-BANK-CANDIDATES.md` (71 sourced candidates across 19 patterns), implementation
  plan: `.docs/PROBLEM-BANK-PILOT-PLAN.md`.
- **Pilot batch shipped**: 3 problems, 1 per pattern, proving the format end-to-end before the
  larger Backtracking batch (6 problems) — **Implement Trie (Prefix Tree)** (Trie),
  **Insert Interval** (Intervals), **LRU Cache** (Design). Each has 2 full solutions (brute force
  → optimal), each solution with its own diagram, a real `DSA.StepPlayer` animation reusing the
  existing engine (`Bars` for the Trie/LRU brute-force solutions, `Graph` for the Trie/LRU optimal
  solutions, a local custom interval-span painter for both Insert Interval solutions — same
  pattern `lessons/day27.html` already established for interval visualizations), code, and
  complexity — plus a complexity-comparison table and a 5-question quiz per problem.
- **New shared files**: `js/problemBank.js` (data: slug/title/pattern/difficulty/prereq day, mirrors
  `curriculum.js`'s role) and `js/problemBankProgress.js` (localStorage tracker under its own
  `problem-bank-progress` key — **deliberately isolated from `DSAProgress`'s `dsa-progress` key**,
  so finishing the Problem Bank never inflates "You finished N/30 days" or vice versa; its
  `totalCount()` is computed from `PROBLEM_BANK.length` at call time, not hardcoded, since the
  final problem count is still an open decision that will keep growing across future batches).
- **Built via Subagent-Driven Development**: 7 implementer/reviewer task pairs, executed directly
  on `main` (no worktree — matches this project's existing convention, explicit user consent
  given since this skill's default is to ask before working on main).
- **2 real bugs caught by task review, both fixed same-session**:
  1. The Trie's optimal-solution animation painted the `startsWith("app")` step's node green
     (`sorted`, which the page's own legend defines as "end of a word") even though `isWord` was
     still `false` at that point — contradicted both the legend and the step's own narration text
     ("returns true regardless of isWord"). Fixed to use `swap` (red, "path exists but not a full
     word"), matching the identical state already correctly used one step earlier for the
     near-identical `search("app")` → false case. **Lesson: when an animation reuses the site's
     shared state/color vocabulary (`sorted`/`swap`/`pointer`/etc.), the choice has to match what
     that page's own legend claims it means, not just "green feels like success" — cross-check the
     legend text against every `pushStep` state assignment.**
  2. A one-character transcription typo in Insert Interval's brute-force explanation prose
     (`start < last[1]` instead of `start <= last[1]`) directly contradicted the actual merge
     condition in the code block shown right above it. Fixed.
- **Also confirmed non-issues during review**: two SVG hex colors (`#21252B`, `#DCDFE4`) got
  flagged as "off-palette" against the plan's own Global Constraints list — turned out both are
  legitimate, pre-existing site tokens (`--bg-raised-2`, `--heading`) already used the same way
  across most existing `lessons/*.html` diagrams. The plan's constraints list was just incomplete,
  not a real violation — worth listing both explicitly if a future plan restates the palette.
- **Browser-verified** (controller, live via Chrome DevTools MCP, not just the subagents' static
  logic traces): every animation across all 3 pages steps through and lands exactly on its
  node-verified final state; zero console errors on any of the 5 new/changed pages; no horizontal
  page-level overflow at ~390-500px mobile width; quiz feedback correct on all 15 questions;
  mark-complete toggles correctly and accumulates across all 3 problems; `problem-bank/index.html`
  correctly reflects per-problem/per-pattern completion live; the homepage's new Problem Bank card
  links correctly and the existing 30-day progress bar/roadmap render unaffected.
- **Next**: Backtracking batch (6 problems) is the planned second batch — not started, order/scope
  of subsequent batches is a standing open decision per the design doc, to be confirmed before
  starting.

## Done — Backtracking batch (Problem Bank's second batch, 6 problems)
- **Shipped**: Combination Sum, Subsets, Permutations, Generate Parentheses, Letter Combinations of
  a Phone Number, N-Queens (Hard — the batch's one Hard problem). All prereq'd on Day 9 (Recursion &
  the Call Stack), matching `js/problemBank.js`'s per-problem `prereqDay`.
- **New renderer variety** in the Problem Bank (previously only used `Graph`/`Bars`/a custom
  interval painter): `DSA.CallStack` for 8 of the 12 solutions (the natural fit for recursive
  backtracking — same renderer Day 9 itself uses), `DSA.Bars` for 2 genuinely-iterative solutions
  (Subsets' bitmask enumeration, Letter Combinations' iterative list-expansion), `DSA.Grid` for
  N-Queens' board (both solutions) — no `js/engine.js` changes needed, all three renderers' existing
  public API covered every case.
- **Complexity honesty, case by case** (no blanket "brute force vs optimal" framing where it isn't
  true): Combination Sum and Permutations/Generate Parentheses/N-Queens get real optimized-vs-naive
  complexity stories; Subsets and Letter Combinations explicitly say the two solutions share the
  SAME asymptotic complexity (different technique, not a speed win) — this distinction is stated
  directly in each page's complexity-comparison section and was specifically checked in every
  review pass.
- **N-Queens' brute-force animation deliberately uses a 3×3 board, not 4×4** — n=3 has zero valid
  solutions (a well-known fact, same as n=2), which keeps the fully-unpruned ~66-step search
  watchable (n=4 unpruned would be ~938 steps). The optimal solution separately uses n=4, where the
  2 real solutions exist. This is explained explicitly on the page (intro paragraph, viz caption,
  and a quiz question) so it doesn't read as a bug.
- **Built via 6 parallel builder agents** (not sequential Subagent-Driven Development like the
  pilot) — matches the design doc's own stated build plan for post-pilot batches, and each of the 6
  new pages is an independent file with no shared-file conflicts. Followed by 6 parallel reviewer
  agents, all against a shared checklist (algorithm re-verification, `STATE_CLASS`/legend
  correctness, ID integrity, no AI attribution, template-structure match). All 12 algorithms and all
  12 animation step-generators were `node -e` verified BEFORE being handed to builder agents — this
  included pre-verifying 6 "trick question" JS-fundamentals snippets (Combination Sum: pushing a
  live array reference instead of `.slice()`; Subsets: `Array.fill()` sharing one reference;
  Permutations: default `.sort()` is lexicographic; Generate Parentheses: `var` vs `let` closure
  capture; Letter Combinations: string comparison is lexicographic; N-Queens: `Set` uses
  SameValueZero, so `Set.has(NaN)` is `true` even though `NaN === NaN` is `false`).
- **2 real bugs caught by review, both fixed same-session** (N-Queens page): (1) the optimal
  solution's legend reused the brute-force legend's "full board checked, invalid" wording for its
  `swap` state, but the optimal animation's `swap` state actually represents single-cell
  column/diagonal pruning BEFORE placement — a different event than what the legend claimed,
  directly undermining the point that solution is teaching. (2) the diagonal-direction explanation
  (`row - col` vs `row + col`, which corresponds to `/` vs `\`) was factually backwards in both the
  line-by-line prose and a quiz's "correct" answer — verified geometrically (row increasing
  downward, col increasing rightward: `row - col` constant traces `\`, `row + col` constant traces
  `/`) and corrected in both places; the underlying `diag1`/`diag2` Set logic itself was always
  correct, only the prose describing it was wrong.
- **A known race from parallel-agent dispatch, caught and verified harmless**: when 6 parallel
  agents each added a "related problems" section to a different page, the first agent to commit
  (`git add -A`-style broad staging) accidentally swept up another agent's uncommitted page changes
  plus my own uncommitted `js/problemBank.js` edit, all under its own commit message. No content
  was lost, corrupted, or duplicated (verified via `git show --stat` on every resulting commit and
  direct diffing) — only the commit *history* misattributes which file changed in which commit.
  **Lesson for next parallel batch: commit my own pending changes before dispatching agents, and
  instruct each agent to `git add <exact-file>`, never `-A`/`-am`, when they share one working
  directory.**

## Done — Interview Corner redesign + trick questions (Problem Bank only)
- User feedback: the Interview Corner (copied from the 30-day lessons' `.interview-list` pattern)
  ran question and answer together in one dense paragraph — hard to scan. New `.pb-interview-item`
  card pattern (own bordered card per question, bold question as its own block, answer broken into
  a bulleted `<ul>` instead of a paragraph) added to `css/style.css`, **scoped to the Problem Bank
  only** — the 30-day lessons keep their existing `.interview-list` untouched, so this wasn't a
  site-wide restyle.
- Retrofitted onto all 9 existing Problem Bank pages (3 pilot + 6 Backtracking).
- Added one verified "trick question" item per page — a real JS-fundamentals gotcha (not generic
  trivia), each tied to that specific page's own code where a natural connection exists (e.g. LRU
  Cache's trick is a detached-method losing `this` binding, directly relevant to a class-based
  solution; Insert Interval's is `.slice()`'s shallow-copy gotcha, directly relevant to why the real
  solution never mutates an interval in place).

## Done — Homepage streak + 30-day progress strip
- `js/progress.js`/`js/problemBankProgress.js` now store a completion **timestamp**
  (`Date.now()`) instead of a bare `true` for each done day/problem — still truthy, so every
  existing `isDone()`/`completedCount()` call site across all 39 pages is unaffected. Pre-existing
  completions recorded before this change still hold literal `true` and are skipped by the new
  `completionTimestamps()` (no real date to report) — a deliberate, honest degradation rather than
  a data migration.
- New `js/streak.js`: combines timestamps from both progress stores into one cross-course streak
  (`{ current, longest }`). Streak logic verified via 7 standalone Node test cases before shipping
  (empty state, today-only, yesterday-only-streak-still-alive, broken streak, consecutive runs,
  longest-vs-current tracking, same-day dedup) — the "streak stays alive until a full day is missed,
  not broken the instant today has no activity yet" rule matches Duolingo's established convention,
  found during a round of UI/UX research into established learning platforms (see below).
- Homepage gets a new compact 30-cell day-by-day progress strip next to the existing progress bar,
  plus the streak label (shown only once it reaches 2+ days, to avoid a "1-day streak" feeling like
  a non-achievement). `problem-bank/index.html` gets the same streak label.
- **UI/UX research pass**: dispatched 4 parallel research agents (NeetCode/LeetCode,
  Educative/Frontend Masters/Brilliant, Duolingo/gamification, AlgoExpert/Grokking) to study how
  established coding-education and learning platforms handle progress/engagement UX. Synthesized
  into quick-wins (streak, per-pattern progress badges — already existed, no work needed; day
  strip; "similar problems" links) vs. bigger engine work (synchronized code↔diagram highlighting —
  not started, flagged as the highest-payoff bigger undertaking if revisited).

## Done — "Related problems" links (Problem Bank)
- New `relatedProblems(slug, limit)` helper in `js/problemBank.js` — returns other problems sharing
  the same pattern, ordered by array distance from the current slug (wraps around), so every
  problem in a pattern sees a varied set of neighbors rather than always the fixed "next 3".
- Only added to the 6 Backtracking pages for now — Trie/Intervals/Design each have just 1 problem
  so far, so `relatedProblems` would correctly return `[]` for them; the section will start
  appearing there automatically once future batches add siblings, no per-page changes needed later.
- Reuses the existing `.day-row`/`.day-list` component (same one `problem-bank/index.html` and the
  homepage roadmap use) — zero new CSS.

## Considered and declined — framework/infra migration
- User asked about migrating to Next.js (or similar) and separately about deploying to Kubernetes.
  Recommended against both: the site's core value proposition (works fully offline, opens directly
  via `file://`, zero build step, zero dependencies) would be lost with a framework migration, and
  GitHub Pages is already free/zero-maintenance/zero-cost with a working custom domain and
  Lighthouse 100 scores — Kubernetes would add real ongoing ops burden (container image, cluster,
  ingress/TLS, manifests) for a site with no backend, no dynamic scaling needs, and no multi-service
  architecture to orchestrate. Noted the actual underlying pain point (boilerplate duplication
  across 39 pages) is real but solvable much more cheaply than either migration. Not acted on
  further — purely a discussion, no plan requested.

## Done — Greedy batch (12 problems, Problem Bank)
- Jump Game II, Gas Station, Candy, Partition Labels, Valid Parenthesis String, Hand of Straights,
  Merge Triplets to Form Target Triplet, Assign Cookies, Can Place Flowers, Boats to Save People,
  Two City Scheduling, Minimum Number of Arrows to Burst Balloons — `js/problemBank.js` grew to 21
  total problems across 5 patterns.
- First batch built via **fully-delegated parallel dispatch**: each of the 12 builder agents got no
  pre-verified algorithm code from the orchestrator at all — only the LeetCode problem statement and
  the expected brute-force/optimal shape — and had to design, implement, and `node -e`-verify both
  solutions itself before writing any HTML. Several agents independently caught that the
  orchestrator's own suggested brute-force approach was actually wrong (not just naive) before
  shipping anything.
- Renderer mix: `DSA.Bars` for most; `DSA.CallStack` for Valid Parenthesis String's brute-force
  backtracking solution; `DSA.Grid` for Merge Triplets (first non-numeric use of Grid — a
  triplet-coordinate table with a target row); the interval-span painter (copied from Insert
  Interval) for Minimum Arrows.
- All 12 committed with `git add <exact-file>` only, dispatched after committing the shared
  `problemBank.js` data change first — zero git-race recurrence this batch (see
  [[parallel_agents_git_race]]), a direct result of the process fix from the earlier Backtracking
  retrofit's race.
- **Review pass found real bugs in 6 of the 12 pages** (2 recurring defect classes, now confirmed
  across 3 separate batches — pilot, Backtracking, Greedy):
  - Valid Parenthesis String: optimal viz set `states[i]='pointer'` then unconditionally overwrote
    it before ever pushing a step — the legend's "current character" highlight could never actually
    appear. Fixed by pushing an intermediate step while the state is still `pointer`.
  - Hand of Straights: optimal viz painted an already-fully-used (skipped) value as `active`
    ("being consumed") instead of `sorted`, contradicting both the legend and that step's own
    narration. Fixed by checking `count.get(v) === 0` before returning `active`.
  - Boats to Save People / Assign Cookies: both used the `compare` (yellow) state in a visualization
    whose legend never defined it — orphan states, the recurring "state fires, no legend entry"
    class. Fixed by adding the missing `lg-compare` legend entries.
  - Merge Triplets — two issues: (1) the brute-force space complexity was claimed as O(n²) but is
    actually bounded by O(n³) (a merged triplet's 3 coordinates are drawn independently from up to
    n distinct a/b/c values each) — caught via an adversarial differential test, not just review-by-
    reading; corrected both the per-solution and comparison tables. (2) A dormant row-index
    collision: `CANDIDATE_ROWS` and `TARGET_ROW` aliased the same grid index (6), so any input whose
    `known` set grows past 6 triplets would silently overwrite the target row's display state.
    Doesn't trigger on the shipped demo but does on LeetCode's own 3rd canonical example (confirmed
    via `node -e`, known-set reaches 12). Fixed by guarding every candidate-row state write with
    `newIdx < CANDIDATE_ROWS` — the algorithm itself is untouched, only the visualization silently
    stops painting rows once they exceed the grid's fixed visual capacity.
  - Candy: the implementer's own HTML-entity cleanup (`&gt;`/`&lt;` → plain `>`/`<`) accidentally
    deleted 5 template-literal narration strings' interpolated values in the process (e.g.
    `ratings[]>ratings[]` instead of `ratings[3]=2>ratings[2]=1`) — caught by a re-dispatched
    reviewer after the first review attempt stalled and failed at 600s. Fixed by restoring the
    missing `${...}` interpolations.
- All 6 fixes verified via direct `node -e`/`vm`-sandboxed re-execution against both the shipped
  demo input (confirming unchanged behavior) and, for Merge Triplets, an adversarial input proven to
  reach the previously-buggy code path (confirming the fix actually closes it) — then committed
  individually and pushed together.
- Remaining 6 of 12 pages (Jump Game II, Partition Labels, Minimum Arrows, Can Place Flowers, Gas
  Station, Two City Scheduling) reviewed clean — Minor/cosmetic notes only, no fixes needed.

## Done — Arrays & Hashing batch (5 problems, Problem Bank)
- Valid Sudoku, First Missing Positive, Majority Element, Maximum Subarray (Kadane's), Longest
  Consecutive Sequence — `js/problemBank.js` grew to 26 total problems across 6 patterns. First
  batch to introduce a new pattern group since the pilot (Trie/Intervals/Design) — `Arrays &
  Hashing` mapped to Day 6 ("Hash Maps & Sets") as its prereq.
- Same fully-delegated parallel dispatch model as the Greedy batch: each of the 5 builder agents
  got only the LeetCode problem statement and the expected brute-force/optimal shape, no
  pre-verified code — each designed, implemented, and `node -e`-verified both solutions itself
  before writing HTML.
- Renderer mix: `DSA.Bars` for 4 of 5; `DSA.Grid` for Valid Sudoku (second-ever non-numeric Grid
  use on the site, after Merge Triplets — a live 9x9 board with row/col/box hash trackers).
- Data-file commit (`js/problemBank.js`) landed first, before dispatching builders — zero
  git-race recurrence, all 5 commits verified single-file via `git show --stat`.
- **Review pass: first batch to go 5-for-5 clean** — zero findings across all 5 pages (algorithm
  correctness, legend/state cross-reference, complexity honesty, ID integrity, Interview Corner
  format, palette, AI-attribution, related-problems wiring all independently re-verified by
  dedicated reviewer agents via direct `node -e` re-execution, not just reading the implementer's
  claims). No fix agents needed, no fix wave required.
- Trick questions this batch: Valid Sudoku (plain-object numeric-key coercion vs `Set`'s
  SameValueZero — digit `5` vs `'5'`), First Missing Positive (naive-swap data loss during an
  in-place index-as-hash placement), Majority Element (`Map` vs plain-object key semantics),
  Maximum Subarray (`Math.max(...[])` on an empty array → `-Infinity`), Longest Consecutive
  Sequence (`Set` canonicalizing `-0` to `+0` on insertion) — each independently `node -e`
  verified by its own reviewer, not just the builder.

## Done — SVG diagram text-overflow fix (sitewide)

- Found and fixed a real, previously-undetected bug: long `<text>` lines inside diagram SVGs
  (mainly the "Cost: ..." complexity line, one box label) were overflowing the diagram's own
  `viewBox` width and getting silently clipped — worst case 338px of text cut off mid-sentence
  on Majority Element. This slipped through every prior review because the site's mobile-
  overflow check only measures page-level `scrollWidth`, not clipping inside an SVG's own
  coordinate space — a genuinely different failure mode.
- Affected 8 pages across 3 different batches (pilot-era `subsets.html`, Backtracking-era
  `letter-combinations-of-a-phone-number.html`, Greedy-era `hand-of-straights.html`/
  `merge-triplets-to-form-target-triplet.html`, and 4 of the just-shipped Arrays & Hashing
  pages) — proof this wasn't specific to one batch's implementer, it was a gap in the
  verification process itself.
- Fixed by splitting the overflowing `<text>` into two lines (`y="140"`/`y="156"`) and growing
  the `<svg>`'s `viewBox` height from 170 to 186. Verified with a headless `getBBox()`-based
  overflow-measurement script (0 overflow across all 8, re-confirmed both locally and against
  the live site) plus a visual screenshot check on the worst case.
- **Added as a new permanent step to the verification workflow** (`CLAUDE.md`, "bug class #4")
  — every future diagram must be checked with the overflow snippet before shipping, and it's
  now baked into every subsequent batch's builder-agent dispatch prompts.

## Done — Stack + Binary Search batch (4 problems, Problem Bank)

- Largest Rectangle in Histogram, Evaluate Reverse Polish Notation (Stack, prereq Day 17);
  Find Minimum in Rotated Sorted Array, Median of Two Sorted Arrays (Binary Search, prereq
  Day 13) — `js/problemBank.js` grew to 30 total problems across 8 patterns.
- Same fully-delegated parallel dispatch model, with the new SVG-overflow check folded directly
  into every builder agent's required pre-commit verification steps.
- Renderer notes: Evaluate RPN and Median of Two Sorted Arrays both needed **two simultaneous
  `DSA.Bars` instances on screen** (token list + live stack; two input arrays respectively) —
  first time this site has needed more than one Bars instance per solution's visualization.
- Median of Two Sorted Arrays — the single hardest problem shipped on this site so far
  (notoriously easy to get subtly wrong) — got extra verification rigor: the builder ran a
  30-case differential test against its own brute-force solution before shipping, and the
  reviewer independently re-ran 2000+500 more randomized differential trials (including a
  batch specifically forcing `nums1` larger than `nums2`, to confirm the "always binary-search
  the smaller array" swap is actually present and correct) — zero mismatches across all of it.
- **Second consecutive batch to go fully clean on review** — 4-for-4, zero findings (following
  the Arrays & Hashing batch's 5-for-5). Largest Rectangle in Histogram's implementer ran 500
  of its own randomized cross-checks against an O(n³) reference before committing; its reviewer
  ran 2000 more independently.
- Process note: 2 of the 4 builder agents pushed to `origin/main` on their own initiative after
  committing, despite only being instructed to commit — not harmful (direct-to-main pushes are
  this repo's normal pattern, and the pushed commits were fully self-verified single-file
  changes) but it meant those 2 pages went live before the review pass completed. Worth being
  more explicit in future dispatch prompts ("commit only, do not push") if push timing needs to
  stay synchronized with the review gate.
- Trick questions this batch: Largest Rectangle (`Array.prototype.pop()` on an empty array
  returns `undefined` without throwing), Evaluate RPN (`parseInt('3*')` → `3` vs `Number('3*')`
  → `NaN`), Find Minimum in Rotated Sorted Array (JS's `Math.floor((lo+hi)/2)` doesn't overflow
  at the 32-bit boundary the way `(a+b)|0` forces wraparound does — a real cross-language
  contrast point), Median of Two Sorted Arrays (`JSON.stringify` silently drops keys whose
  value is `undefined` but keeps ones set to `null` — relevant to the sentinel-boundary logic
  in the optimal solution).

## Done — Two Pointers batch (4 problems, Problem Bank)

- Trapping Rain Water, 4Sum, Next Permutation, Find the Duplicate Number — all prereq Day 4
  ("Two-Pointer Pattern"). `js/problemBank.js` grew to 34 total problems across 9 patterns.
- Same fully-delegated parallel dispatch model, with an explicit new instruction this batch:
  "commit only, do NOT push" — a direct fix for the process gap noted in the Stack + Binary
  Search batch, where 2 of 4 agents pushed unprompted. All 4 agents followed it correctly this
  time; the orchestrator pushed once after the full review pass confirmed clean.
- **Third consecutive batch to go fully clean on review** — 4-for-4, zero findings (following
  Arrays & Hashing's 5-for-5 and Stack + Binary Search's 4-for-4). Two implementers self-caught
  and fixed real bugs in their own first drafts before ever committing: Trapping Rain Water's
  two-pointer solution initially decided direction using a stale max (fixed, then turned into an
  Interview Corner question); Next Permutation's builder ran the strongest possible correctness
  proof unprompted — applying the algorithm 23 times from `[1,2,3,4]` and diffing the resulting
  sequence against an independently-computed sorted list of all 24 permutations, byte-identical.
  Reviewers independently re-ran equivalent proofs rather than trusting the reports.
- Renderer note: Find the Duplicate Number's optimal solution (Floyd's Cycle Detection) used
  `DSA.Graph` instead of `DSA.Bars` for its "array as implicit linked list, values point to
  indices" framing — the reviewer specifically traced both phases of the two-pointer algorithm
  (meet-inside-cycle, then reset-and-re-meet-at-entrance) directly against the shipped code to
  confirm neither phase was shortcut, since a broken phase 2 is the classic way this famous
  algorithm silently produces wrong answers while still passing easy test cases.
  4Sum's reviewer additionally verified the specific numeric-vs-lexicographic `.sort()` gotcha
  the page's trick question was built around, independently of the page's own claim.
- Trick questions this batch: Trapping Rain Water (`Math.max(...[])`/`Math.min(...[])` on an
  empty array), 4Sum (`.sort()` defaults to lexicographic/string order on numbers, not numeric —
  `[10,2,1].sort()` → `[1,10,2]`), Next Permutation (`Array.prototype.reverse()` mutates in
  place and returns the SAME reference, not a copy), Find the Duplicate Number (`NaN` is
  unfindable via `.indexOf()` but findable via `.includes()`/`Set.has()`, due to `===` vs
  SameValueZero semantics).

## Environment for local preview
```bash
cd /Users/zain/projects/dsa
python3 -m http.server 8000
# open http://localhost:8000/
```
(A background server was running on port 8791 during this session for verification via
Chrome DevTools MCP — kill/restart as needed in a new session.)
