# Research: "30 Days of DSA in JavaScript — Interview Ready" Static Site

Research conducted 2026-07-22 for a static (no framework, no build step) GitHub Pages site.
This file is **pure research** — no site code or scaffolding was written as part of this task.

---

## 1. Sources found — the 6 repos, license verified

For each repo, the license claim was checked by fetching the actual `LICENSE` file (raw GitHub
content) and/or querying the GitHub REST API (`/repos/{owner}/{repo}` → `.license` field), not by
trusting the repo's own README claims.

### 1. `trekhleb/javascript-algorithms`
- URL: https://github.com/trekhleb/javascript-algorithms
- **Verified license: MIT.** Fetched raw file directly:
  `https://raw.githubusercontent.com/trekhleb/javascript-algorithms/master/LICENSE`
  → opens with `The MIT License (MIT) / Copyright (c) 2018 Oleksii Trekhleb / Permission is hereby
  granted, free of charge...`
- Stats: ~196k stars, 31k forks, actively maintained.
- Structure: algorithms + data structures organized by topic (math, strings, sorting, graphs,
  DP, cryptography), each with its own README, complexity tables, and further-reading links.
- **Use:** topic-list + structural inspiration for the 30-day curriculum ordering, and — because
  it's MIT — we *may* adapt short reference explanations/complexity tables with attribution if
  useful, but we are still writing all lesson prose and visualizer code ourselves.

### 2. `lydiahallie/javascript-questions`
- URL: https://github.com/lydiahallie/javascript-questions
- **Verified license: MIT.** Fetched raw file:
  `https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/LICENSE`
  → `MIT License / Copyright (c) 2019 Lydia Hallie / Permission is hereby granted...`
- Stats: ~65.3k stars, 20+ language translations. Format: multiple-choice JS quiz questions with
  detailed explanations (closures, hoisting, event loop, prototypes, etc.).
- **Use:** MIT license permits adapting question text with credit. Good inspiration for the
  "quiz" step format (multiple choice + explanation) at the end of each lesson, especially for
  any JS-fundamentals days (closures, `this`, async) that overlap with pure DSA days.

### 3. `yangshun/tech-interview-handbook`
- URL: https://github.com/yangshun/tech-interview-handbook
- **Verified license: MIT.** Fetched raw file:
  `https://raw.githubusercontent.com/yangshun/tech-interview-handbook/main/LICENSE`
  → `MIT License / Copyright (c) 2017-Present Yangshun Tay / Permission is hereby granted...`
- Stats: ~141k stars. Covers algorithm patterns (Grind 75 / Blind 75 lineage), behavioral prep,
  resume/negotiation, front-end-specific interview prep. Docusaurus site at
  techinterviewhandbook.org.
- **Use:** MIT — topic list and pattern groupings (e.g. "Grind 75" style curated problem sets) are
  useful for picking which 30 problems/patterns to cover across the month. May lightly adapt short
  explanatory text with credit; we write our own lesson content.

### 4. `TheAlgorithms/JavaScript`
- URL: https://github.com/TheAlgorithms/JavaScript
- **Verified license: GPL-3.0.** Fetched raw file:
  `https://raw.githubusercontent.com/TheAlgorithms/JavaScript/master/LICENSE`
  → full text is the **GNU General Public License, Version 3, 29 June 2007**. Confirmed matches
  the claim.
- Stats: ~34.2k stars, "Algorithms and Data Structures implemented in JavaScript for beginners,
  following best practices."
- **Use: topic-list only, NEVER copy code or text.** GPL-3.0 is copyleft — copying any code from
  this repo into our MIT/permissive-intent static site would create license-compatibility
  obligations we don't want. We will look at *what algorithms it covers* for curriculum breadth
  checks only, and implement everything ourselves from scratch.

### 5. `rohan-paul/Awesome-JavaScript-Interviews`
- URL: https://github.com/rohan-paul/Awesome-JavaScript-Interviews
- **Verified: NO LICENSE file exists.** Two independent checks:
  1. `curl` HEAD against both `https://raw.githubusercontent.com/rohan-paul/Awesome-JavaScript-Interviews/master/LICENSE`
     and `.../main/LICENSE` → **HTTP 404** on both.
  2. GitHub API: `curl https://api.github.com/repos/rohan-paul/Awesome-JavaScript-Interviews | jq .license`
     → **`null`**.
- Stats: ~3.7k stars, 882 forks. Description: "Popular JavaScript / React / Node / Mongo stack
  Interview questions and their answers. Many of them, I faced in actual interviews..."
- **Use: topics/question titles only, no license = default "all rights reserved."** We will write
  our own answers/explanations from scratch; may use the general *list of topics asked* as a
  checklist to make sure our 30 days cover what's commonly asked, but never copy question text
  or answer text verbatim.

### 6. `greatfrontend/top-javascript-interview-questions`
- URL: https://github.com/greatfrontend/top-javascript-interview-questions
- **Verified: NO LICENSE file exists.** Same two checks:
  1. `curl` HEAD against both `main` and `master` branch `LICENSE` paths → **HTTP 404** on both.
  2. GitHub API `.license` field → **`null`**.
- Description: "Top JavaScript interview questions and answers for Frontend Engineers (updated
  for 2026)." Companion to the GreatFrontEnd site's ~190+ JS interview questions and "Blind 75"
  style DSA question lists (see greatfrontend.com/questions/javascript-dsa-interview-questions).
- **Use: topics/question titles only, no license.** Same rule as #5 — use as a checklist for
  curriculum coverage (which JS/DSA questions are "commonly asked" in front-end interviews),
  write our own answers and code entirely from scratch.

### Summary table

| Repo | Verified license | Evidence | Usage |
|---|---|---|---|
| trekhleb/javascript-algorithms | MIT | raw LICENSE file | topics + may adapt short text w/ credit |
| lydiahallie/javascript-questions | MIT | raw LICENSE file | quiz-format inspiration, may adapt w/ credit |
| yangshun/tech-interview-handbook | MIT | raw LICENSE file | topic/pattern list, may adapt w/ credit |
| TheAlgorithms/JavaScript | GPL-3.0 | raw LICENSE file (full GPLv3 text) | topics only, never copy code/text |
| rohan-paul/Awesome-JavaScript-Interviews | None | 404 on LICENSE + GitHub API `license: null` | topics only, write our own |
| greatfrontend/top-javascript-interview-questions | None | 404 on LICENSE + GitHub API `license: null` | topics only, write our own |

No licensing surprises versus the user's claims — all 6 verified exactly as claimed (3 MIT, 1
GPL-3.0, 2 no-license).

---

## 2. Additional sources found during research

### Visualizer projects (inspiration for our from-scratch engine, category b)
- **VisuAlgo** (https://visualgo.net/en) — the gold-standard reference. Built by NUS, 24
  visualization modules (arrays, linked lists, BST, heaps, hash tables, graph traversal/MST/
  shortest-path/flow/matching, segment/Fenwick trees, union-find, sorting, convex hull, etc.).
  Key ideas worth borrowing (not code, just UX patterns): step-by-step animation with a scrubber,
  dual-speed comparison mode, user-editable input arrays/graphs instead of only presets, and a
  "pseudocode panel that highlights the current line" synced to the animation frame.
- **Algorithm Visualizer** (arnabuchiha, GitHub topic `sorting-visualizer`) — React app covering
  sorting, pathfinding, convex hull; useful for seeing what algorithm categories people expect a
  "visualizer" to include (sorting bars, pathfinding grid, hull/geometry).
- **WebSort** (ThatSINEWAVE) — simple bar-based sorting visualizer, good minimal reference for the
  "array as bars" animation idiom we'll build ourselves in vanilla canvas/SVG.
- Several smaller React sorting-visualizer clones (maksimbar, MusadiqPasha, thisisnitish,
  hoanganhnh, iamujj15) — all converge on the same pattern: array → bar chart, color-coded
  compare/swap/sorted states, speed slider, algorithm dropdown. This is a useful "expected feature
  baseline" for our bars component even though we won't use any of their code (React-based, not
  license-checked, not needed — we're building vanilla JS from scratch anyway).
- GitHub topic pages for reference/breadth: https://github.com/topics/sorting-visualizer ,
  https://github.com/topics/algorithm-visualization , https://github.com/topics/sorting-algorithm-visualizations

### DSA / interview-prep collections (category c)
- **GreatFrontEnd JavaScript DSA Questions** — https://www.greatfrontend.com/questions/javascript-dsa-interview-questions
  (~190+ questions, guided solutions, "Blind 75"-style curated lists solved in JS/TS specifically
  for front-end engineers). Good for cross-checking our 30-day topic coverage.
- **sadanandpai/dsa-for-front-end-dev** — https://github.com/sadanandpai/dsa-for-front-end-dev —
  "Data structures and algorithms for front-end interviews." Worth a license check before any
  reuse beyond topic names if we lean on it later (not verified in this pass — flag for follow-up
  if we decide to use it beyond a topic-list glance).
- **Grind 75 / Blind 75** lineage (surfaced via tech-interview-handbook and GreatFrontEnd) — the
  de-facto canonical "75 most important DSA interview questions" list; useful as a cross-reference
  when picking which patterns our 30 days should hit (arrays/strings, two pointers, sliding
  window, binary search, trees, graphs, DP, backtracking, heaps, linked lists).
- **madza.hashnode.dev — "14 GitHub Repositories to Ace Your JavaScript Interviews"** —
  https://madza.hashnode.dev/14-github-repositories-to-ace-your-javascript-interviews — a curated
  roundup listing further repos worth a glance (not individually license-checked here; treat any
  as no-license/topics-only until verified).

### Course/tutorial site structure (category d)
- **W3Schools DSA Tutorial** — https://www.w3schools.com/dsa/ — beginner-friendly, animation-
  driven explanations, "Try it" runnable examples, exercises, and quizzes, organized as a step-by-
  step syllabus (https://www.w3schools.com/dsa/dsa_syllabus.php). Good reference for the overall
  "syllabus page → per-topic lesson" IA we should mirror.
- **CodeIntuition** — https://www.codeintuition.io/ — explicit flow of *structure → complexity →
  advantages/limitations → correctness reasoning* BEFORE code, plus "frame-by-frame dry runs"
  showing memory/pointer/recursion state changes in real time. This maps closely to the
  goal → concept → visualization → code → complexity → practice → quiz flow requested for our
  site — validates that ordering as a proven pattern.
- **Namaste DSA** — https://namastedev.com/learn/namaste-dsa — line-by-line concept breakdown
  (what/why/how to optimize) before showing time/space complexity, then code. Reinforces
  "understand before you see code" ordering.
- **DSA Visualizer** (https://www.dsavisualizer.in/) and **VisualizedDSA**
  (https://visualizedsa.com/) — both pair step-by-step animation with inline quizzes and
  real-time complexity/metric readouts (comparisons, swaps, pointer positions) during playback —
  good validation for showing live operation counters (comparisons/swaps) alongside our
  visualizations, not just a static Big-O label.

### Common traps research (category e) — see full bullet list in section 5 below.
Key source excerpts used:
- Codeforces blog on off-by-one/edge cases in binary search & two-pointer:
  https://codeforces.com/blog/entry/50041
- "Binary Search (done right)": https://raw.org/book/algorithms/binary-search/
- Binary Search Pitfalls (Medium): https://uofiszhou42.medium.com/binary-search-pitfalls-illustrated-by-examples-18169ef300f
- youcademy.org — Common Mistakes in Binary Search and How to Avoid Them:
  https://youcademy.org/common-mistakes-in-binary-search/
- TutorChase — recursive algorithm pitfalls:
  https://www.tutorchase.com/answers/ib/computer-science/what-are-common-pitfalls-when-designing-recursive-algorithms
- Interview Cake — Memoization and Dynamic Programming Explained:
  https://www.interviewcake.com/concept/java/memoization
- interviewing.io — Memoization Interview Questions & Tips:
  https://interviewing.io/memoization-interview-questions
- AlgoCademy — Tackling Dynamic Programming Problems in Interviews:
  https://algocademy.com/blog/tackling-dynamic-programming-problems-in-interviews/

---

## 3. What we will reuse (specific, per-source)

- **Day topic ordering / curriculum breadth** — cross-referenced against trekhleb's algorithm
  category list (MIT, topics only used), tech-interview-handbook's Grind 75 pattern grouping (MIT,
  topics only used), and GreatFrontEnd's + rohan-paul's "commonly asked" question lists (no
  license on both — topics only, we write our own answers).
- **Quiz step format** (multiple-choice + "why" explanation, shown after the code section) —
  inspired by `lydiahallie/javascript-questions` (MIT). Because it's MIT, we *may* adapt actual
  question text/explanations with credit in an attribution note if we borrow specific JS-
  fundamentals questions (e.g. closures/hoisting on a day that touches JS internals) — but for all
  DSA-specific quiz questions (binary search, DP, trees) we write our own from scratch, since
  those aren't from her repo at all.
- **Lesson flow ordering** (goal → concept → visualization → code → complexity → practice → quiz)
  — validated as a proven pattern by CodeIntuition and Namaste DSA's stated teaching sequence
  (structure/why → complexity → code), not copied text, just confirms our planned IA is sound.
- **Live operation counters during animation** (comparisons/swaps/recursive-call count shown next
  to the Big-O label) — pattern observed on DSA Visualizer / VisualizedDSA / VisuAlgo; we implement
  our own counter logic, not their code.
- **Explicit non-reuse:** `TheAlgorithms/JavaScript` (GPL-3.0) — topic names only, e.g. confirming
  "which sorts/searches/DP problems are considered core" — zero code or prose copied.
  `rohan-paul/Awesome-JavaScript-Interviews` and `greatfrontend/top-javascript-interview-questions`
  (both no-license) — question *topics* only (e.g. "closures," "debounce/throttle implementation,"
  "flatten nested array") to sanity-check curriculum coverage; all answer text and code written
  from scratch in-house.

---

## 4. What we will build ourselves (fully original, dependency-free)

Everything executable or narrative on the site is original, vanilla HTML/CSS/JS with zero
runtime dependencies (works fully offline, no CDN, no build step):

- **The visualizer engine** — bars for sorting (array state → canvas/SVG bar heights + color-coded
  compare/swap/sorted states), node-link diagrams for trees/graphs (BFS/DFS/tree traversal
  highlighting), and grid rendering for DP tables/pathfinding — all built from scratch in plain
  JS/Canvas or SVG, with our own animation/step-scrubber framework (no D3, no React, no visualizer
  libraries). We looked at VisuAlgo/WebSort/etc. only for *UX pattern* ideas (scrubber, speed
  slider, step highlighting), never their code.
- **All lesson prose** — goal statements, concept explanations, complexity analysis writeups —
  written from scratch for all 30 days.
- **All SVG diagrams** — hand-authored inline SVG (or generated via our own small script), no
  external diagram libraries or image assets pulled from any of the researched repos.
- **All code implementations** shown in lessons — every algorithm/data-structure implementation on
  the site is our own from-scratch JS, not copied from trekhleb, TheAlgorithms, or anywhere else
  (even where trekhleb's MIT license would technically permit copying, we're writing our own for
  consistency of style/teaching voice across all 30 days).
- **All practice problems and quiz questions** for DSA-specific days (binary search, recursion,
  trees, graphs, DP, etc.) — original, informed only by *topic checklists* from the researched
  repos, never copied text.

---

## 5. Common traps to cover in lesson content

### Binary search
- Loop condition off-by-one: using `low < high` instead of `low <= high` (or vice versa depending
  on invariant) causes the target to be missed when it sits exactly at the boundary index.
- Ambiguous interval semantics: not being consistent about whether `high`/the upper bound is
  inclusive or exclusive — mixing the two within one implementation is the #1 source of bugs.
- Non-shrinking search space / infinite loop: an update like `low = mid` (without `+1`) when
  `mid = Math.floor((low+high)/2)` and `low === high - 1` never advances, looping forever.
- Midpoint overflow: `(low + high) / 2` can overflow in fixed-width integer languages; in JS this
  specific overflow isn't an issue (doubles), but we should still teach `low + Math.floor((high -
  low) / 2)` as the safer general pattern since it transfers to other languages.
- Forgetting binary search requires a *sorted* (or monotonic-predicate) input — applying it to
  unsorted data silently gives wrong answers, not an error.
- "Binary search on the answer" pattern confusion — conflating searching an array's indices with
  searching a value range/predicate space (different mental model, same off-by-one risks).
- Citing the famous stat (Bentley, "Programming Pearls"): most professional engineers get a
  from-scratch binary search wrong on the first try — good framing for why we drill it on Day 1-ish.

### Recursion
- Missing or wrong base case → infinite recursion → stack overflow (classic first bug).
- Base case that doesn't match all terminating inputs (e.g. assumes non-empty input but gets
  called with an empty array/zero) — needs an explicit guard.
- Recursive call not actually shrinking the problem (forgetting to update/pass a smaller
  sub-problem each call) — infinite recursion even with a base case present.
- Not returning the recursive call's result (calling `fn(n-1)` without `return`) — silently
  returns `undefined` up the chain.
- Confusing mutation vs. return-based recursion — mutating shared state across branches when the
  algorithm assumes each branch is independent (classic backtracking bug: forgetting to "undo" a
  choice before the next iteration).
- Stack depth limits in JS specifically — deep recursion (e.g. naive recursive Fibonacci or
  recursion over a large array) can hit real call-stack limits; worth mentioning
  iterative/tail-call alternatives even though JS engines don't reliably optimize TCO.

### Dynamic programming / memoization
- Forgetting/incorrectly defining the base case(s) before writing the recursive case — same root
  cause as plain recursion bugs, but easier to miss inside a memo table.
- Off-by-one errors in DP table indices — extremely common when the table is sized `n+1` to
  represent "0 items" as a valid state, and lesson code must be explicit about that convention.
- Cache-key bugs in top-down memoization: using an incomplete or mutable object/array as a Map key
  (reference vs. value equality) causes false cache misses or, worse, false hits across different
  states.
- Not clearing/scoping the memo cache correctly across independent calls (stale cache reused
  across separate test inputs) — an easy footgun in interview settings with a module-level cache.
- Recursion depth blowing the stack in top-down memoized solutions even though the "same"
  bottom-up/tabulated version wouldn't (memoized recursion still recurses even when
  cached — cache avoids recomputation, not stack depth).
- Choosing the wrong state dimensions (under-specifying what varies between subproblems) leading
  to a memo table that returns wrong cached answers for different real states.
- Space-optimization pitfalls: naively rolling a 2D DP table down to 1D and overwriting values
  that a later step in the same row still needs (iteration-direction bugs, e.g. knapsack must
  iterate capacity in reverse when compressing to 1D).

---

## Sources (all links)

- https://github.com/trekhleb/javascript-algorithms
- https://raw.githubusercontent.com/trekhleb/javascript-algorithms/master/LICENSE
- https://github.com/lydiahallie/javascript-questions
- https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/LICENSE
- https://github.com/yangshun/tech-interview-handbook
- https://raw.githubusercontent.com/yangshun/tech-interview-handbook/main/LICENSE
- https://github.com/TheAlgorithms/JavaScript
- https://raw.githubusercontent.com/TheAlgorithms/JavaScript/master/LICENSE
- https://github.com/rohan-paul/Awesome-JavaScript-Interviews
- https://github.com/greatfrontend/top-javascript-interview-questions
- https://api.github.com/repos/rohan-paul/Awesome-JavaScript-Interviews
- https://api.github.com/repos/greatfrontend/top-javascript-interview-questions
- https://visualgo.net/en
- https://github.com/topics/sorting-visualizer?l=javascript&o=desc&s=stars
- https://github.com/topics/algorithm-visualization
- https://github.com/topics/sorting-algorithm-visualizations
- https://www.greatfrontend.com/questions/javascript-dsa-interview-questions
- https://github.com/sadanandpai/dsa-for-front-end-dev
- https://madza.hashnode.dev/14-github-repositories-to-ace-your-javascript-interviews
- https://www.w3schools.com/dsa/
- https://www.w3schools.com/dsa/dsa_syllabus.php
- https://www.codeintuition.io/
- https://namastedev.com/learn/namaste-dsa
- https://www.dsavisualizer.in/
- https://visualizedsa.com/
- https://codeforces.com/blog/entry/50041
- https://raw.org/book/algorithms/binary-search/
- https://uofiszhou42.medium.com/binary-search-pitfalls-illustrated-by-examples-18169ef300f
- https://youcademy.org/common-mistakes-in-binary-search/
- https://www.tutorchase.com/answers/ib/computer-science/what-are-common-pitfalls-when-designing-recursive-algorithms
- https://www.interviewcake.com/concept/java/memoization
- https://interviewing.io/memoization-interview-questions
- https://algocademy.com/blog/tackling-dynamic-programming-problems-in-interviews/
