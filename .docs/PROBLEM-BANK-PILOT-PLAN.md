# Problem Bank Pilot Batch — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Problem Bank pilot batch — 3 problems (Implement Trie (Prefix Tree), Insert Interval, LRU Cache), one per pattern (Trie, Intervals, Design) — proving the full page template, the multi-solution format, and the prereq-link mechanism end-to-end before the larger Backtracking batch.

**Architecture:** Pure static HTML/CSS/JS, zero build step, matching the existing 30-day course exactly. Two new shared JS data/state files (`js/problemBank.js`, `js/problemBankProgress.js`) mirror `js/curriculum.js`/`js/progress.js`. A new `problem-bank/` folder (parallel to `lessons/`) holds a pattern-grouped landing page plus one file per problem. Every problem page reuses the site's existing shared engine (`js/engine.js`'s `StepPlayer`/`Bars`/`Graph` renderers) and existing CSS classes (`.card`, `.problem`, `.viz-panel`, `.dsa-quiz`, `.complexity-table`, `.week-section`/`.day-row` family) — no new CSS framework, only the minimal additions listed in Task 3.

**Tech Stack:** Vanilla HTML5, CSS3, ES6 JavaScript. No frameworks, no npm, no bundler. Node.js (already on the system) is used only as a throwaway verification harness (`node -e '...'`) to prove each solution's algorithm is correct before it's written into a page — it is never shipped or referenced by the site itself.

**This project's verification convention (not this skill's default TDD):** this codebase has no automated test suite. The established, working pipeline (used for all 30 existing lessons) is: (1) `node -e` verify every real algorithm against known inputs/outputs BEFORE writing any HTML, (2) write the page, (3) browser-verify (console errors, animation traced step-by-step against the node-verified output, mobile-width overflow check, quiz/reveal/mark-complete wiring), (4) fix anything found, (5) commit. Every task below follows that shape instead of a red/green unit-test cycle — this is a deliberate match to project convention, not a deviation from this skill's spirit. All algorithm code in Tasks 5-7 below has **already been node-verified** (transcripts included in each task) — the implementer re-runs the same verification command as a sanity check, not as new work.

## Global Constraints

- **No AI/Claude attribution anywhere** — not in commit messages, not in code comments, not in file contents. (User's global `~/.claude/CLAUDE.md` rule, applies to every project.)
- **Verify the active `gh` account is `zainulhasan`** (`gh auth status`) immediately before every `git push` — the machine's active account can silently change between sessions.
- **No build step, no dependencies.** Every file must work opened directly via `file://` — this rules out ES modules (`type="module"`), `fetch()` of local files, and anything requiring a server.
- **Reuse `js/engine.js` as-is.** Do not modify `StepPlayer`, `Bars`, `Graph`, `Grid`, `CallStack`, `wireQuiz`, or `wireReveals` — every animation in this batch is implemented using the existing public API, exactly like every one of the 30 lessons.
- **Exact palette hex values only**, matching `css/tokens.css` and the values already used in every existing lesson's inline SVGs: `--c-neutral #3E4452` (text `#ABB2BF`), `--c-compare #E6C07B` (text `#282C34`), `--c-swap #E06C75` (text `#282C34`), `--c-sorted #98C379` (text `#282C34`), `--c-pointer #61AEEE` (text `#282C34`), `--c-active #C678DD` (text `#282C34`), body text `#E2E3E7`, dim text `#9198A6`. Never hardcode a color not in this list.
- **The 3 recurring bug classes** (documented in `.docs/NOTES.md`, apply to every new diagram/table in this batch):
  1. Unbroken slash/hyphen-joined tokens or wide table cells can force horizontal overflow on mobile — wrap any table wider than its container in `<div style="overflow-x:auto;">`.
  2. SVG `<text>` lines must not overlap ADJACENT text elements even when each individually looks short enough — leave generous vertical spacing (≥18px between stacked text lines at 12-13px font size).
  3. `DSA.Graph` node/label positions must stay well clear of the SVG's edges (node circles have a fixed radius of 18 in the renderer — keep every node center ≥40px from any viewBox edge).
- **Directed-graph edges must clear the target node's rim.** `DSA.Graph`'s renderer already does this automatically (pulls the line endpoint back by radius 18 before attaching the arrowhead marker) — nothing to do here, just don't bypass `Graph.render()`.
- **Mark-complete progress is tracked separately from the 30-day course.** Problem Bank pages use `ProblemBankProgress`, never `DSAProgress` — the two must never read or write each other's `localStorage` key.
- **No git push without explicit confirmation from the user for this batch's final commit** — commit locally as each task completes, but confirm with the user before the final `git push` (matches how every previous batch in this project was shipped).

---

### Task 1: `js/problemBankProgress.js` — localStorage progress tracker

**Files:**
- Create: `js/problemBankProgress.js`

**Interfaces:**
- Consumes: the global `PROBLEM_BANK` array from `js/problemBank.js` (Task 2) — specifically `PROBLEM_BANK.length` — so `js/problemBank.js` **must be `<script>`-included before this file** on every page that uses it.
- Produces: global `ProblemBankProgress` object with `{ isDone(slug), setDone(slug, done), toggle(slug), completedCount(), totalCount() }`, consumed by Tasks 3, 5, 6, 7.

- [ ] **Step 1: Write the file**

```js
/*
 * Problem Bank — progress tracking, stored in localStorage.
 * Key: "problem-bank-progress" -> { "<slug>": true, ... } (LeetCode slug -> done)
 * Independent of the 30-day course's DSAProgress ("dsa-progress" key) — the two
 * must never read or write each other's storage key.
 */
const ProblemBankProgress = (function () {
  'use strict';
  const KEY = 'problem-bank-progress';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function isDone(slug) {
    return !!load()[slug];
  }

  function setDone(slug, done) {
    const data = load();
    if (done) data[slug] = true;
    else delete data[slug];
    save(data);
  }

  function toggle(slug) {
    const done = !isDone(slug);
    setDone(slug, done);
    return done;
  }

  function completedCount() {
    const data = load();
    return Object.keys(data).filter((k) => data[k]).length;
  }

  // Computed at call time from problemBank.js's data array length, NOT hardcoded —
  // the final problem count grows with every future batch (see PROBLEM-BANK-DESIGN.md §4).
  function totalCount() {
    return PROBLEM_BANK.length;
  }

  return {
    isDone,
    setDone,
    toggle,
    completedCount,
    totalCount,
  };
})();
```

- [ ] **Step 2: Sanity-check in Node (module-free, so exercise it via a tiny localStorage shim)**

Run:
```bash
node -e '
global.localStorage = (function () {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = v; },
  };
})();
global.PROBLEM_BANK = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];
eval(require("fs").readFileSync("js/problemBankProgress.js", "utf8"));
console.log("totalCount:", ProblemBankProgress.totalCount());
console.log("isDone(a) before:", ProblemBankProgress.isDone("a"));
ProblemBankProgress.toggle("a");
console.log("isDone(a) after toggle:", ProblemBankProgress.isDone("a"));
console.log("completedCount:", ProblemBankProgress.completedCount());
ProblemBankProgress.toggle("a");
console.log("completedCount after untoggle:", ProblemBankProgress.completedCount());
'
```
Expected output:
```
totalCount: 3
isDone(a) before: false
isDone(a) after toggle: true
completedCount: 1
completedCount after untoggle: 0
```

- [ ] **Step 3: Commit**

```bash
git add js/problemBankProgress.js
git commit -m "add Problem Bank progress tracker"
```

---

### Task 2: `js/problemBank.js` — problem data file

**Files:**
- Create: `js/problemBank.js`

**Interfaces:**
- Consumes: nothing.
- Produces: global `PROBLEM_BANK` array (each entry: `{ slug, title, pattern, difficulty, prereqDay, prereqTitle, leetcodeUrl }`), global `PROBLEM_BANK_PATTERNS` array (`{ key, title }`), global function `problemBankInfo(slug)`. Consumed by Task 1 (`totalCount`), Task 3 (landing page), Tasks 5-7 (each problem page reads its own entry for the prereq banner and header).

- [ ] **Step 1: Write the file**

```js
/* Problem Bank — problem list, shared by problem-bank/index.html and every problem page. */
const PROBLEM_BANK = [
  {
    slug: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    pattern: 'Trie',
    difficulty: 'Medium',
    prereqDay: 19,
    prereqTitle: 'Trees — BFS & DFS',
    leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
  },
  {
    slug: 'insert-interval',
    title: 'Insert Interval',
    pattern: 'Intervals',
    difficulty: 'Medium',
    prereqDay: 29,
    prereqTitle: 'Mock Interview Day',
    leetcodeUrl: 'https://leetcode.com/problems/insert-interval/',
  },
  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    pattern: 'Design',
    difficulty: 'Medium',
    prereqDay: 15,
    prereqTitle: 'Linked Lists',
    leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
  },
];

const PROBLEM_BANK_PATTERNS = [
  { key: 'Trie', title: 'Trie' },
  { key: 'Intervals', title: 'Intervals' },
  { key: 'Design', title: 'Design' },
];

function problemBankInfo(slug) {
  return PROBLEM_BANK.find((p) => p.slug === slug) || null;
}
```

- [ ] **Step 2: Sanity-check in Node**

Run:
```bash
node -e '
eval(require("fs").readFileSync("js/problemBank.js", "utf8"));
console.log("count:", PROBLEM_BANK.length);
console.log("patterns:", PROBLEM_BANK_PATTERNS.map((p) => p.key).join(","));
console.log("lookup:", JSON.stringify(problemBankInfo("lru-cache")));
console.log("missing:", problemBankInfo("nope"));
'
```
Expected output:
```
count: 3
patterns: Trie,Intervals,Design
lookup: {"slug":"lru-cache","title":"LRU Cache","pattern":"Design","difficulty":"Medium","prereqDay":15,"prereqTitle":"Linked Lists","leetcodeUrl":"https://leetcode.com/problems/lru-cache/"}
missing: null
```

- [ ] **Step 3: Commit**

```bash
git add js/problemBank.js
git commit -m "add Problem Bank problem data"
```

---

### Task 3: `problem-bank/index.html` — landing page

**Files:**
- Create: `problem-bank/index.html`

**Interfaces:**
- Consumes: `PROBLEM_BANK`, `PROBLEM_BANK_PATTERNS`, `problemBankInfo` (Task 2), `ProblemBankProgress` (Task 1).
- Produces: nothing consumed by other tasks, but Task 4's homepage card links here (`problem-bank/index.html`), and Tasks 5-7's "← Problem Bank" nav links here too (`index.html`, same directory).

Reuses the homepage's existing roadmap CSS classes verbatim (`.week-section`, `.week-header`, `.week-num`, `.week-subtitle`, `.week-progress`, `.day-list`, `.day-row`, `.day-badge`, `.day-info`, `.day-title`, `.day-meta`, `.day-meta-icon`, `.day-blurb`, `.day-status`, `.status-text`, `.chevron-circle`) — same visual language as the 30-day roadmap, zero new CSS needed for the pattern-grouped list itself. One new class is added in Task 3b below for a "more coming soon" note.

- [ ] **Step 1: Write the file**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Problem Bank — 30 Days of DSA in JavaScript</title>
<meta name="description" content="Drill real interview questions pattern by pattern, each with multiple solutions from brute force to optimal — a companion to the 30-day course." />
<link rel="canonical" href="https://dsa.itszain.tech/problem-bank/index.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Problem Bank — 30 Days of DSA in JavaScript" />
<meta property="og:description" content="Drill real interview questions pattern by pattern, each with multiple solutions from brute force to optimal — a companion to the 30-day course." />
<meta property="og:url" content="https://dsa.itszain.tech/problem-bank/index.html" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Problem Bank — 30 Days of DSA in JavaScript" />
<meta name="twitter:description" content="Drill real interview questions pattern by pattern, each with multiple solutions from brute force to optimal — a companion to the 30-day course." />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23282C34'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='%2361AEEE'%3E%E2%8C%81%3C/text%3E%3C/svg%3E" />
<link rel="stylesheet" href="../css/style.css" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "30 Days of DSA in JavaScript", "item": "https://dsa.itszain.tech/" },
    { "@type": "ListItem", "position": 2, "name": "Problem Bank", "item": "https://dsa.itszain.tech/problem-bank/index.html" }
  ]
}
</script>
</head>
<body>
<header class="site-header">
  <a class="brand" href="../index.html">⌁ 30 Days of DSA — JS</a>
  <nav><a href="../index.html">← Home</a></nav>
</header>

<main class="container">
  <p class="mono" style="color:var(--text-dim);font-size:0.85rem;">PROBLEM BANK</p>
  <h1>Problem Bank</h1>
  <p>Done with the 30-day course, or just want more reps? These are real, frequently-asked
    interview questions, grouped by pattern. Every problem shows multiple solutions — brute
    force through optimal — with its own diagram and animation for each one, plus a link back
    to the 30-day lesson that teaches the prerequisite pattern.</p>

  <section class="card" aria-live="polite">
    <div class="progress-label" id="progressLabel">You finished 0/3 problems</div>
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" id="progressFill" style="width:0%"></div>
    </div>
  </section>

  <div id="patternRoadmap"></div>

  <p class="bank-more-note">More patterns are added in batches — this is the pilot batch,
    proving the format on 3 problems before the next one ships.</p>
</main>

<footer class="site-footer">
  30 Days of DSA in JavaScript — a personal study project.
</footer>

<script src="../js/curriculum.js"></script>
<script src="../js/problemBank.js"></script>
<script src="../js/problemBankProgress.js"></script>
<script>
  function renderPatternGroups() {
    const roadmap = document.getElementById('patternRoadmap');
    roadmap.innerHTML = '';
    PROBLEM_BANK_PATTERNS.forEach(({ key, title }) => {
      const problemsInPattern = PROBLEM_BANK.filter((p) => p.pattern === key);
      if (problemsInPattern.length === 0) return;
      const doneInPattern = problemsInPattern.filter((p) => ProblemBankProgress.isDone(p.slug)).length;

      const section = document.createElement('section');
      section.className = 'week-section';
      section.innerHTML = `
        <div class="week-header">
          <h3><span class="week-num">${title}</span></h3>
          <span class="week-progress">${doneInPattern}/${problemsInPattern.length} done</span>
        </div>
        <div class="day-list"></div>
      `;
      const list = section.querySelector('.day-list');

      problemsInPattern.forEach(({ slug, title: problemTitle, difficulty, prereqDay, prereqTitle }) => {
        const done = ProblemBankProgress.isDone(slug);
        const a = document.createElement('a');
        a.className = 'day-row' + (done ? ' done' : '');
        a.href = `${slug}.html`;
        a.innerHTML = `
          <span class="day-badge">${done ? '✓' : difficulty[0]}</span>
          <span class="day-info">
            <span class="day-title">${problemTitle}</span>
            <span class="day-meta">
              <svg class="day-meta-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3h12M2 8h12M2 13h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              <span class="day-blurb">${difficulty} · builds on Day ${prereqDay}: ${prereqTitle}</span>
            </span>
          </span>
          <span class="day-status">
            <span class="status-text">${done ? 'Done' : 'Not started'}</span>
            <span class="chevron-circle" aria-hidden="true">
              <svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </span>
          </span>
        `;
        list.appendChild(a);
      });

      roadmap.appendChild(section);
    });
  }

  function renderProgress() {
    const done = ProblemBankProgress.completedCount();
    const total = ProblemBankProgress.totalCount();
    document.getElementById('progressLabel').textContent = `You finished ${done}/${total} problems`;
    document.getElementById('progressFill').style.width = `${total ? (done / total) * 100 : 0}%`;
  }

  renderPatternGroups();
  renderProgress();
</script>
</body>
</html>
```

- [ ] **Step 2: Add the one new CSS rule this page needs**

The page reuses every existing class except `.bank-more-note`, which doesn't exist yet. Open `css/style.css`, find the `.week-progress { ... }` rule (search for it — it's in the "roadmap: week-grouped detail list" section), and add immediately after that rule's closing brace:

```css
.bank-more-note {
  color: var(--text-dim);
  font-size: 0.85rem;
  text-align: center;
  margin: 2rem 0 1rem;
}
```

- [ ] **Step 3: Verify no leftover reference errors**

Run:
```bash
node -e '
eval(require("fs").readFileSync("js/curriculum.js", "utf8"));
eval(require("fs").readFileSync("js/problemBank.js", "utf8"));
global.localStorage = (function () { let s = {}; return { getItem: (k) => (k in s ? s[k] : null), setItem: (k, v) => { s[k] = v; } }; })();
eval(require("fs").readFileSync("js/problemBankProgress.js", "utf8"));
console.log("PROBLEM_BANK loaded OK, length:", PROBLEM_BANK.length);
console.log("ProblemBankProgress loaded OK, totalCount:", ProblemBankProgress.totalCount());
'
```
Expected: no errors, `length: 3`, `totalCount: 3`. This proves the three `<script>` includes on the page (`curriculum.js` is unused here but harmless — actually see note below) load in a valid order with no undefined-reference crashes.

**Note:** `problem-bank/index.html`'s script includes list `curriculum.js` above — remove that `<script src="../js/curriculum.js"></script>` line from the file before finishing this task; it's not used by this page (only `problemBank.js` and `problemBankProgress.js` are) and including unused scripts isn't this project's convention. Keep the verification command above as written (it explicitly loads `curriculum.js` too, harmlessly, just to double-check nothing on the page accidentally depends on `DSA_DAYS`/`DSA_WEEKS` — it doesn't).

- [ ] **Step 4: Commit**

```bash
git add problem-bank/index.html css/style.css
git commit -m "add Problem Bank landing page"
```

---

### Task 4: Homepage link

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: nothing new.
- Produces: a discoverable link into `problem-bank/index.html` from the site's actual homepage.

- [ ] **Step 1: Insert a new card**

In `index.html`, find this existing block (it's the progress card, right before `<h2>The 30-Day Roadmap</h2>`):

```html
  <section class="card" aria-live="polite">
    <div class="progress-label" id="progressLabel">You finished 0/30 days</div>
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" id="progressFill" style="width:0%"></div>
    </div>
    <div class="continue-row">
      <a class="btn btn-primary" id="continueBtn" href="lessons/day01.html">▶ Start Day 1</a>
    </div>
  </section>

  <h2>The 30-Day Roadmap</h2>
```

Replace it with (adds one new `<section class="card">` in between, changes nothing else):

```html
  <section class="card" aria-live="polite">
    <div class="progress-label" id="progressLabel">You finished 0/30 days</div>
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" id="progressFill" style="width:0%"></div>
    </div>
    <div class="continue-row">
      <a class="btn btn-primary" id="continueBtn" href="lessons/day01.html">▶ Start Day 1</a>
    </div>
  </section>

  <section class="card">
    <h2 style="margin-top:0;">Problem Bank</h2>
    <p>Done with the 30-day course, or just want more reps? Drill real interview questions,
      pattern by pattern, each with multiple solutions from brute force to optimal.</p>
    <a class="btn" href="problem-bank/index.html">Browse the Problem Bank →</a>
  </section>

  <h2>The 30-Day Roadmap</h2>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "link Problem Bank from the homepage"
```

---

### Task 5: `problem-bank/implement-trie-prefix-tree.html`

**Files:**
- Create: `problem-bank/implement-trie-prefix-tree.html`

**Interfaces:**
- Consumes: `js/curriculum.js` is NOT needed on this page. Consumes `js/engine.js` (`DSA.StepPlayer`, `DSA.Bars`, `DSA.Graph`, `DSA.wireQuiz`, `DSA.wireReveals`), `js/problemBankProgress.js` (`ProblemBankProgress.isDone/toggle`).
- Produces: nothing consumed elsewhere.

**Both solutions below are already node-verified.** Verification transcript:

```
node -e '
class TrieBruteForce {
  constructor() { this.words = new Set(); }
  insert(word) { this.words.add(word); }
  search(word) { return this.words.has(word); }
  startsWith(prefix) { for (const w of this.words) { if (w.startsWith(prefix)) return true; } return false; }
}
class TrieNode { constructor() { this.children = new Map(); this.isWord = false; } }
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
  _walk(str) {
    let node = this.root;
    for (const ch of str) { if (!node.children.has(ch)) return null; node = node.children.get(ch); }
    return node;
  }
  search(word) { const node = this._walk(word); return node !== null && node.isWord; }
  startsWith(prefix) { return this._walk(prefix) !== null; }
}
function runSequence(TrieClass) {
  const trie = new TrieClass(); const out = [];
  trie.insert("apple");
  out.push(trie.search("apple")); out.push(trie.search("app")); out.push(trie.startsWith("app"));
  trie.insert("app");
  out.push(trie.search("app"));
  return out;
}
console.log("BruteForce:", runSequence(TrieBruteForce));
console.log("Optimal   :", runSequence(Trie));
'
```
Output (matches expected `[ true, false, true, true ]` for both):
```
BruteForce: [ true, false, true, true ]
Optimal   : [ true, false, true, true ]
```

- [ ] **Step 1: Re-run the verification command above**

Run it exactly as shown. Confirm both lines print `[ true, false, true, true ]` before writing any HTML.

- [ ] **Step 2: Write the file**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Implement Trie (Prefix Tree) — Problem Bank</title>
<meta name="description" content="Implement Trie (Prefix Tree): brute-force word Set vs. an optimal Trie of Map nodes, both animated, with full line-by-line code." />
<link rel="canonical" href="https://dsa.itszain.tech/problem-bank/implement-trie-prefix-tree.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Implement Trie (Prefix Tree) — Problem Bank" />
<meta property="og:description" content="Implement Trie (Prefix Tree): brute-force word Set vs. an optimal Trie of Map nodes, both animated, with full line-by-line code." />
<meta property="og:url" content="https://dsa.itszain.tech/problem-bank/implement-trie-prefix-tree.html" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Implement Trie (Prefix Tree) — Problem Bank" />
<meta name="twitter:description" content="Implement Trie (Prefix Tree): brute-force word Set vs. an optimal Trie of Map nodes, both animated, with full line-by-line code." />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23282C34'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='%2361AEEE'%3E%E2%8C%81%3C/text%3E%3C/svg%3E" />
<link rel="stylesheet" href="../css/style.css" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "30 Days of DSA in JavaScript", "item": "https://dsa.itszain.tech/" },
    { "@type": "ListItem", "position": 2, "name": "Problem Bank", "item": "https://dsa.itszain.tech/problem-bank/index.html" },
    { "@type": "ListItem", "position": 3, "name": "Implement Trie (Prefix Tree)", "item": "https://dsa.itszain.tech/problem-bank/implement-trie-prefix-tree.html" }
  ]
}
</script>
</head>
<body>
<header class="site-header">
  <a class="brand" href="../index.html">⌁ 30 Days of DSA — JS</a>
  <nav><a href="index.html">← Problem Bank</a></nav>
</header>

<main class="container">
  <div class="card prereq-banner">
    <p>📚 <strong>Builds on <a href="../lessons/day19.html">Day 19: Trees — BFS & DFS</a></strong> —
      a Trie is a tree where each node is one character; read that lesson first if tree traversal
      is still new.</p>
  </div>

  <p class="mono" style="color:var(--text-dim);font-size:0.85rem;">TRIE &middot; MEDIUM</p>
  <h1>Implement Trie (Prefix Tree) <span class="leetcode-link">(<a href="https://leetcode.com/problems/implement-trie-prefix-tree/" target="_blank" rel="noopener">LeetCode: Implement Trie (Prefix Tree)</a>)</span></h1>

  <h2>The problem</h2>
  <p>Design a data structure that supports three operations: <code>insert(word)</code> — add a
    word; <code>search(word)</code> — return true only if that exact word was previously
    inserted; <code>startsWith(prefix)</code> — return true if any previously inserted word
    starts with that prefix. All three should stay fast even with many words sharing common
    prefixes, like <code>"app"</code>, <code>"apple"</code>, and <code>"application"</code>.</p>

  <h2>Solution 1: Brute force — a Set of whole words</h2>
  <p>The simplest thing that could work: keep every inserted word in a <code>Set</code>.
    <code>insert</code> is trivial. <code>search</code> is a direct membership check. But
    <code>startsWith</code> has no shortcut — nothing about a <code>Set</code> knows which words
    share a prefix, so it has to check every single stored word.</p>

  <svg class="diagram" viewBox="0 0 640 200" role="img" aria-label="Diagram of the brute-force trie: three words, apple, banana, and app, stored as plain strings in a Set. A search for app must scan every stored word one at a time until a match is found or the set is exhausted.">
    <text x="20" y="28" font-size="13" fill="#61AEEE" font-weight="bold">Brute force: one flat Set of whole words</text>
    <g font-family="var(--font-head)" font-size="13">
      <rect x="20" y="50" width="140" height="40" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="90" y="75" text-anchor="middle" fill="#E2E3E7">"apple"</text>
      <rect x="180" y="50" width="140" height="40" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="250" y="75" text-anchor="middle" fill="#E2E3E7">"banana"</text>
      <rect x="340" y="50" width="140" height="40" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="410" y="75" text-anchor="middle" fill="#E2E3E7">"app"</text>
    </g>
    <text x="20" y="130" font-size="12" fill="#DCDFE4">search("app") has to check every entry in order — there's no</text>
    <text x="20" y="148" font-size="12" fill="#DCDFE4">shortcut for shared prefixes like "apple" and "app".</text>
    <text x="20" y="180" font-size="12" fill="#E06C75">Cost: O(n &times; m) per search, where n = word count and m = word length.</text>
  </svg>

  <h3>Interactive visualization</h3>
  <div class="legend">
    <span><i class="lg-compare"></i> currently checking</span>
    <span><i class="lg-sorted"></i> match found</span>
  </div>
  <div class="viz-panel">
    <div class="viz-stage"><div id="viz1Stage"></div></div>
    <div class="narration" id="viz1Narration">Press Play or Step to begin.</div>
    <div class="viz-controls">
      <button class="btn btn-primary" id="viz1Play">▶ Play</button>
      <button class="btn" id="viz1Step">Step ⏭</button>
      <button class="btn" id="viz1Reset">⟲ Reset</button>
      <button class="btn" id="viz1Shuffle">🔀 Shuffle</button>
      <span class="viz-counter" id="viz1Counter"></span>
    </div>
  </div>

  <h3>The code</h3>
  <pre><code>class TrieBruteForce {
  constructor() {
    this.words = new Set();
  }
  insert(word) {
    this.words.add(word);
  }
  search(word) {
    return this.words.has(word);
  }
  startsWith(prefix) {
    for (const w of this.words) {
      if (w.startsWith(prefix)) return true;
    }
    return false;
  }
}</code></pre>
  <p><strong>Line by line:</strong></p>
  <ul>
    <li><code>insert</code> is O(word length) — just hashing the string into the Set.</li>
    <li><code>search</code> is a direct <code>Set.has</code> lookup — also fast on its own.</li>
    <li><code>startsWith</code> is the expensive one: it has to loop over every stored word and
      call <code>.startsWith(prefix)</code> on each, because a flat Set has no structure that
      groups words by their shared prefixes.</li>
  </ul>

  <h3>Complexity</h3>
  <table class="complexity-table">
    <thead><tr><th>insert</th><th>search</th><th>startsWith</th><th>Space</th></tr></thead>
    <tbody><tr><td>O(m)</td><td>O(n &times; m)</td><td>O(n &times; m)</td><td>O(n &times; m)</td></tr></tbody>
  </table>

  <h2>Solution 2: Optimal — a Trie of Map nodes</h2>
  <p>Instead of storing whole words, store one node per character. Words that share a prefix
    share the same chain of nodes — <code>"app"</code> and <code>"apple"</code> both walk through
    the same <code>a → p → p</code> nodes before diverging. Each node knows whether it's the end
    of a real inserted word via an <code>isWord</code> flag.</p>

  <svg class="diagram" viewBox="0 0 640 220" role="img" aria-label="Diagram of a trie holding the words app and apple: root connects to a, which connects to p, which connects to a second p marked as end-of-word for app, which connects to l, which connects to e marked as end-of-word for apple. Shared prefix characters are stored only once.">
    <text x="20" y="28" font-size="13" fill="#61AEEE" font-weight="bold">Optimal: one Trie node per character, shared prefixes stored once</text>
    <g stroke="#3E4452" stroke-width="2">
      <line x1="60" y1="90" x2="140" y2="90"/>
      <line x1="140" y1="90" x2="220" y2="90"/>
      <line x1="220" y1="90" x2="300" y2="90"/>
      <line x1="300" y1="90" x2="380" y2="90"/>
      <line x1="380" y1="90" x2="460" y2="90"/>
    </g>
    <g font-family="var(--font-head)" font-size="13" text-anchor="middle">
      <circle cx="60" cy="90" r="18" fill="#282C34" stroke="#61AEEE" stroke-width="2"/>
      <text x="60" y="95" fill="#61AEEE">•</text>
      <circle cx="140" cy="90" r="18" fill="#3E4452" stroke="#21252B"/>
      <text x="140" y="95" fill="#E2E3E7">a</text>
      <circle cx="220" cy="90" r="18" fill="#3E4452" stroke="#21252B"/>
      <text x="220" y="95" fill="#E2E3E7">p</text>
      <circle cx="300" cy="90" r="18" fill="#98C379" stroke="#21252B"/>
      <text x="300" y="95" fill="#282C34">p</text>
      <circle cx="380" cy="90" r="18" fill="#3E4452" stroke="#21252B"/>
      <text x="380" y="95" fill="#E2E3E7">l</text>
      <circle cx="460" cy="90" r="18" fill="#98C379" stroke="#21252B"/>
      <text x="460" y="95" fill="#282C34">e</text>
    </g>
    <text x="300" y="140" font-size="11" fill="#98C379" text-anchor="middle">green = end of a word (isWord)</text>
    <text x="20" y="180" font-size="12" fill="#DCDFE4">"app" and "apple" share the a-p-p prefix — it's stored once, not once per word.</text>
    <text x="20" y="198" font-size="12" fill="#E06C75">Cost: O(m) per operation, where m = word/prefix length — independent of word count.</text>
  </svg>

  <h3>Interactive visualization</h3>
  <div class="legend">
    <span><i class="lg-active"></i> node just created</span>
    <span><i class="lg-pointer"></i> traversal path</span>
    <span><i class="lg-sorted"></i> end of a word</span>
    <span><i class="lg-swap"></i> path exists but not a full word</span>
  </div>
  <div class="viz-panel">
    <div class="viz-stage"><div id="viz2Stage"></div></div>
    <div class="narration" id="viz2Narration">Press Play or Step to begin.</div>
    <div class="viz-controls">
      <button class="btn btn-primary" id="viz2Play">▶ Play</button>
      <button class="btn" id="viz2Step">Step ⏭</button>
      <button class="btn" id="viz2Reset">⟲ Reset</button>
      <span class="viz-counter" id="viz2Counter"></span>
    </div>
  </div>
  <p style="color:var(--text-dim);font-size:0.85rem;">This animation traces the exact sequence
    verified above: insert("apple"), search("apple"), search("app"), startsWith("app"),
    insert("app"), search("app").</p>

  <h3>The code</h3>
  <pre><code>class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
  _walk(str) {
    let node = this.root;
    for (const ch of str) {
      if (!node.children.has(ch)) return null;
      node = node.children.get(ch);
    }
    return node;
  }
  search(word) {
    const node = this._walk(word);
    return node !== null && node.isWord;
  }
  startsWith(prefix) {
    return this._walk(prefix) !== null;
  }
}</code></pre>
  <p><strong>Line by line:</strong></p>
  <ul>
    <li><code>insert</code> walks one character at a time, creating a child node only when that
      character isn't already there — this is exactly what makes shared prefixes free.</li>
    <li><code>_walk</code> is shared by both <code>search</code> and <code>startsWith</code> — it
      returns the node reached by following a string's characters, or <code>null</code> the
      moment a character has no matching child.</li>
    <li><code>search</code> additionally requires <code>isWord</code> to be true — reaching a
      node isn't enough, since that node might only represent a prefix, not a full inserted word
      (this is the <code>search("app")</code> before <code>insert("app")</code> case).</li>
    <li><code>startsWith</code> only needs the path to exist — it doesn't care whether the final
      node is a complete word.</li>
  </ul>

  <h3>Complexity</h3>
  <table class="complexity-table">
    <thead><tr><th>insert</th><th>search</th><th>startsWith</th><th>Space</th></tr></thead>
    <tbody><tr><td>O(m)</td><td>O(m)</td><td>O(m)</td><td>O(total characters across all words, shared prefixes counted once)</td></tr></tbody>
  </table>

  <h2>Complexity comparison</h2>
  <div style="overflow-x:auto;">
  <table class="complexity-table">
    <thead><tr><th>Solution</th><th>insert</th><th>search</th><th>startsWith</th></tr></thead>
    <tbody>
      <tr><td>Brute force (Set of words)</td><td>O(m)</td><td>O(n &times; m)</td><td>O(n &times; m)</td></tr>
      <tr><td>Optimal (Trie, Map children)</td><td>O(m)</td><td>O(m)</td><td>O(m)</td></tr>
    </tbody>
  </table>
  </div>

  <h2>Quiz</h2>

  <div class="dsa-quiz" data-answer="scans" data-explain="The brute-force Set has no structure grouping words by shared prefixes — every search or startsWith call has to scan stored words one at a time, so more words directly means more comparisons per call.">
    <p class="q-text">1. Why does the brute-force Set approach get slower as more words are added, even for a single search?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="scans">It has no shared-prefix structure, so it scans stored words one at a time</button>
      <button class="btn dsa-quiz-option" data-value="constant">It doesn't — Set lookups are always O(1) regardless of word count</button>
      <button class="btn dsa-quiz-option" data-value="sorted">Sets keep words in sorted order, which slows lookups down</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="complete" data-explain="isWord marks that the path leading to this node spells out a complete word that was actually inserted — not just a prefix that happens to exist because a longer word passes through it.">
    <p class="q-text">2. What does each Trie node's <code>isWord</code> flag mean?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="complete">The path to this node spells out a complete inserted word</button>
      <button class="btn dsa-quiz-option" data-value="haschildren">This node has at least one child</button>
      <button class="btn dsa-quiz-option" data-value="rootonly">This node is the root of the trie</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="reuse" data-explain="Inserting 'apple' already created the a, p, p nodes as a shared prefix chain. Inserting 'app' afterward just reuses that exact chain and flips the second p node's isWord flag to true — no new nodes needed." >
    <p class="q-text">3. Why doesn't inserting "app" after "apple" create 3 new nodes?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="reuse">The a-p-p prefix chain already exists from inserting "apple" — it's reused</button>
      <button class="btn dsa-quiz-option" data-value="ignored">"app" is ignored because it's shorter than an existing word</button>
      <button class="btn dsa-quiz-option" data-value="auto">Tries automatically deduplicate every operation regardless of characters</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="isword" data-explain="Both walk the exact same nodes for a shared string. search additionally checks the final node's isWord flag; startsWith only cares that the path exists at all." >
    <p class="q-text">4. <code>search("app")</code> and <code>startsWith("app")</code> both walk the same 3 nodes (a, p, p). What's the one difference between them?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="isword">search additionally checks the final node's isWord flag</button>
      <button class="btn dsa-quiz-option" data-value="nowalk">search doesn't walk the tree at all</button>
      <button class="btn dsa-quiz-option" data-value="faster">startsWith is always faster because it stops early</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="om" data-explain="Every Trie operation only ever touches nodes along the path for the given string, so the cost depends purely on that string's length m, never on how many words n are stored." >
    <p class="q-text">5. What's the time complexity of the optimal Trie's insert/search, in terms of word length m and word count n?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="om">O(m) — independent of n</button>
      <button class="btn dsa-quiz-option" data-value="onm">O(n &times; m) — same as the brute force</button>
      <button class="btn dsa-quiz-option" data-value="logn">O(log n)</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="continue-row">
    <button class="btn btn-primary" id="completeBtn">Mark problem complete</button>
  </div>
  <div class="continue-row">
    <a class="btn" href="index.html">← Back to Problem Bank</a>
  </div>
</main>

<footer class="site-footer">
  30 Days of DSA in JavaScript — a personal study project.
</footer>

<script src="../js/problemBank.js"></script>
<script src="../js/problemBankProgress.js"></script>
<script src="../js/engine.js"></script>
<script>
  const SLUG = 'implement-trie-prefix-tree';

  // ---- Solution 1: brute-force word scan (DSA.Bars, uniform — words as opaque labels) ----
  function buildBruteForceTrieSteps(words, query) {
    const steps = [];
    const states = words.map(() => 'default');
    steps.push({ narration: `Words stored: ${words.map((w) => '"' + w + '"').join(', ')}. Searching for "${query}" — a plain linear scan.`, data: words.slice(), states: states.slice() });
    let foundIndex = -1;
    for (let i = 0; i < words.length; i++) {
      states[i] = 'compare';
      steps.push({ narration: `Checking "${words[i]}" against "${query}"...`, data: words.slice(), states: states.slice() });
      if (words[i] === query) {
        states[i] = 'sorted';
        foundIndex = i;
        steps.push({ narration: `Match — "${words[i]}" === "${query}", found after checking ${i + 1} word${i === 0 ? '' : 's'}.`, data: words.slice(), states: states.slice() });
        break;
      }
    }
    if (foundIndex === -1) {
      steps.push({ narration: `Checked all ${words.length} words — "${query}" was never inserted, so search returns false.`, data: words.slice(), states: states.slice() });
    }
    return steps;
  }

  function randomTrieWords() {
    const pool = ['cat', 'car', 'cart', 'dog', 'dodge', 'do', 'dove', 'ant', 'anthem', 'bee'];
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    const words = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));
    const query = Math.random() < 0.6 ? words[Math.floor(Math.random() * words.length)] : shuffled[shuffled.length - 1];
    return { words, query };
  }

  const bars1 = new DSA.Bars(document.getElementById('viz1Stage'), { uniform: true });
  let bf = randomTrieWords();
  bars1.setData(bf.words);
  let steps1 = buildBruteForceTrieSteps(bf.words, bf.query);
  const player1 = new DSA.StepPlayer({
    steps: steps1,
    narrationEl: document.getElementById('viz1Narration'),
    counterEl: document.getElementById('viz1Counter'),
    playBtn: document.getElementById('viz1Play'),
    stepBtn: document.getElementById('viz1Step'),
    resetBtn: document.getElementById('viz1Reset'),
    shuffleBtn: document.getElementById('viz1Shuffle'),
    speed: 900,
    onStep(step) {
      if (!step) { bars1.setData(bf.words); return; }
      bars1.paint(step.states, step.data);
    },
    onShuffle() {
      bf = randomTrieWords();
      bars1.setData(bf.words);
      steps1 = buildBruteForceTrieSteps(bf.words, bf.query);
      player1.setSteps(steps1);
    },
  });

  // ---- Solution 2: optimal Trie (DSA.Graph, growing node/edge set per step) ----
  const TRIE_X = (depth) => 60 + depth * 90;
  const TRIE_Y = 100;

  function buildTrieOptimalSteps() {
    const steps = [];
    const nodeMap = new Map();
    nodeMap.set('', { id: 'root', label: '•', x: TRIE_X(0), y: TRIE_Y, isWord: false });

    function snapshot() {
      const nodes = Array.from(nodeMap.values()).map((n) => Object.assign({}, n));
      const edges = [];
      nodeMap.forEach((node, path) => {
        if (path === '') return;
        const parentPath = path.slice(0, -1);
        edges.push({ from: nodeMap.get(parentPath).id, to: node.id, directed: true });
      });
      return { nodes, edges };
    }

    function stateFor(activeStates) {
      const out = {};
      nodeMap.forEach((node) => { if (node.isWord) out[node.id] = 'sorted'; });
      Object.keys(activeStates).forEach((path) => { out[nodeMap.get(path).id] = activeStates[path]; });
      return out;
    }

    function pushStep(narration, activeStates) {
      const { nodes, edges } = snapshot();
      steps.push({ narration, nodes, edges, states: stateFor(activeStates || {}) });
    }

    pushStep('Trie starts with just a root node — no characters stored yet.');

    function insert(word) {
      let path = '';
      pushStep(`insert("${word}") — start at the root.`, { '': 'active' });
      for (const ch of word) {
        path += ch;
        if (!nodeMap.has(path)) {
          nodeMap.set(path, { id: path, label: ch, x: TRIE_X(path.length), y: TRIE_Y, isWord: false });
          pushStep(`No child "${ch}" from here yet — create a new node.`, { [path]: 'active' });
        } else {
          pushStep(`Child "${ch}" already exists — reuse it (shared prefix, no new node).`, { [path]: 'active' });
        }
      }
      nodeMap.get(path).isWord = true;
      pushStep(`Mark the last node as end-of-word — "${word}" is now a complete word in the trie.`, { [path]: 'sorted' });
    }

    function walk(str, label) {
      let path = '';
      const seen = [''];
      pushStep(`${label}("${str}") — start at the root.`, { '': 'pointer' });
      for (const ch of str) {
        path += ch;
        seen.push(path);
        const states = {};
        seen.forEach((p) => { states[p] = 'pointer'; });
        pushStep(`Follow "${ch}" — now at node "${path}".`, states);
      }
    }

    insert('apple');
    walk('apple', 'search');
    pushStep('Reached the end of "apple" — isWord is true, so search returns true.', { apple: 'sorted' });

    walk('app', 'search');
    pushStep('Reached the end of "app" — isWord is false (only a prefix so far), so search returns false.', { app: 'swap' });

    walk('app', 'startsWith');
    pushStep('Reached the end of "app" — the path exists, so startsWith returns true regardless of isWord.', { app: 'sorted' });

    insert('app');

    walk('app', 'search');
    pushStep('Reached the end of "app" — isWord is now true, so search returns true.', { app: 'sorted' });

    return steps;
  }

  function paintTrieGraph(graph, step) {
    graph.nodes = step.nodes;
    graph.edges = step.edges;
    graph.render(step.states || {});
  }

  const graph2 = new DSA.Graph(document.getElementById('viz2Stage'), { width: 560, height: 200 });
  const steps2 = buildTrieOptimalSteps();
  const player2 = new DSA.StepPlayer({
    steps: steps2,
    narrationEl: document.getElementById('viz2Narration'),
    counterEl: document.getElementById('viz2Counter'),
    playBtn: document.getElementById('viz2Play'),
    stepBtn: document.getElementById('viz2Step'),
    resetBtn: document.getElementById('viz2Reset'),
    speed: 900,
    onStep(step) { paintTrieGraph(graph2, step || steps2[0]); },
  });
  paintTrieGraph(graph2, steps2[0]);

  // ---- quiz + reveal wiring ----
  DSA.wireQuiz(document);
  DSA.wireReveals(document);

  // ---- mark complete ----
  const completeBtn = document.getElementById('completeBtn');
  function refreshCompleteBtn() {
    const done = ProblemBankProgress.isDone(SLUG);
    completeBtn.textContent = done ? '✓ Complete — click to undo' : 'Mark problem complete';
    completeBtn.classList.toggle('btn-done', done);
    completeBtn.classList.toggle('btn-primary', !done);
  }
  completeBtn.addEventListener('click', () => {
    ProblemBankProgress.toggle(SLUG);
    refreshCompleteBtn();
  });
  refreshCompleteBtn();
</script>
</body>
</html>
```

- [ ] **Step 3: Add the prereq-banner CSS (only needed once — skip if Task 6 or 7 already added it)**

Open `css/style.css`, find the `.problem .leetcode-link { ... }` rule (in the practice-problem section), and add immediately after it:

```css
.prereq-banner { margin-bottom: 1.25rem; }
.prereq-banner p { margin: 0; color: var(--text-dim); font-size: 0.92rem; }
.prereq-banner a { color: var(--accent); }
```

- [ ] **Step 4: Browser-verify**

Open `problem-bank/implement-trie-prefix-tree.html` directly in a browser (`file://` path — no server). Check:
- No console errors.
- Solution 1's Play/Step/Shuffle buttons work; narration text updates; Shuffle changes the word list and query.
- Solution 2's Play/Step buttons work; the trie graph grows from a single root node up through the full "apple"/"app" chain exactly as narrated; no node or edge overlaps the SVG's edges or another node (per Global Constraints' bug class 3).
- Both diagrams render with no clipped or overlapping text (bug class 2) at both desktop and ~390px mobile width (bug class 1 — nothing should force horizontal scroll on the page itself; the diagrams' own `overflow-x` behavior matches every other lesson's `.diagram` class already in `css/style.css`).
- All 5 quiz questions give correct feedback for both the right and a wrong answer.
- "Mark problem complete" toggles, and reloading the page preserves the completed state (`localStorage` under the `problem-bank-progress` key — confirm via devtools that it does NOT touch the `dsa-progress` key).
- "← Back to Problem Bank" and "← Problem Bank" header nav both go to `problem-bank/index.html`, which in turn shows this problem's row as done.

Fix anything found before moving to Task 6.

- [ ] **Step 5: Commit**

```bash
git add problem-bank/implement-trie-prefix-tree.html css/style.css
git commit -m "add Implement Trie (Prefix Tree) problem page"
```

---

### Task 6: `problem-bank/insert-interval.html`

**Files:**
- Create: `problem-bank/insert-interval.html`

**Interfaces:**
- Consumes: `js/engine.js` (`DSA.StepPlayer`, `DSA.wireQuiz`, `DSA.wireReveals` — note this page does NOT use `Bars`/`Graph`, it uses a local custom interval-span painter, exactly like `lessons/day27.html`'s `makeIntervalViz`), `js/problemBankProgress.js`.
- Produces: nothing consumed elsewhere.

**Both solutions below are already node-verified.** Verification transcript:

```
node -e '
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const result = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = sorted[i];
    if (start <= last[1]) { last[1] = Math.max(last[1], end); }
    else { result.push([start, end]); }
  }
  return result;
}
function insertBruteForce(intervals, newInterval) {
  return mergeIntervals(intervals.concat([newInterval]));
}
function insertOptimal(intervals, newInterval) {
  const result = []; let i = 0; const n = intervals.length; let [ns, ne] = newInterval;
  while (i < n && intervals[i][1] < ns) { result.push(intervals[i]); i++; }
  while (i < n && intervals[i][0] <= ne) { ns = Math.min(ns, intervals[i][0]); ne = Math.max(ne, intervals[i][1]); i++; }
  result.push([ns, ne]);
  while (i < n) { result.push(intervals[i]); i++; }
  return result;
}
const ex1 = [[1,3],[6,9]], new1 = [2,5];
const ex2 = [[1,2],[3,5],[6,7],[8,10],[12,16]], new2 = [4,8];
console.log("BruteForce ex1:", JSON.stringify(insertBruteForce(ex1, new1)));
console.log("Optimal    ex1:", JSON.stringify(insertOptimal(ex1, new1)));
console.log("BruteForce ex2:", JSON.stringify(insertBruteForce(ex2, new2)));
console.log("Optimal    ex2:", JSON.stringify(insertOptimal(ex2, new2)));
'
```
Output (matches LeetCode's canonical examples for both solutions):
```
BruteForce ex1: [[1,5],[6,9]]
Optimal    ex1: [[1,5],[6,9]]
BruteForce ex2: [[1,2],[3,10],[12,16]]
Optimal    ex2: [[1,2],[3,10],[12,16]]
```

- [ ] **Step 1: Re-run the verification command above**

Confirm all 4 output lines match before writing any HTML.

- [ ] **Step 2: Write the file**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Insert Interval — Problem Bank</title>
<meta name="description" content="Insert Interval: a brute-force sort-and-merge solution vs. an optimal 3-phase linear scan, both animated, with full line-by-line code." />
<link rel="canonical" href="https://dsa.itszain.tech/problem-bank/insert-interval.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Insert Interval — Problem Bank" />
<meta property="og:description" content="Insert Interval: a brute-force sort-and-merge solution vs. an optimal 3-phase linear scan, both animated, with full line-by-line code." />
<meta property="og:url" content="https://dsa.itszain.tech/problem-bank/insert-interval.html" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Insert Interval — Problem Bank" />
<meta name="twitter:description" content="Insert Interval: a brute-force sort-and-merge solution vs. an optimal 3-phase linear scan, both animated, with full line-by-line code." />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23282C34'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='%2361AEEE'%3E%E2%8C%81%3C/text%3E%3C/svg%3E" />
<link rel="stylesheet" href="../css/style.css" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "30 Days of DSA in JavaScript", "item": "https://dsa.itszain.tech/" },
    { "@type": "ListItem", "position": 2, "name": "Problem Bank", "item": "https://dsa.itszain.tech/problem-bank/index.html" },
    { "@type": "ListItem", "position": 3, "name": "Insert Interval", "item": "https://dsa.itszain.tech/problem-bank/insert-interval.html" }
  ]
}
</script>
</head>
<body>
<header class="site-header">
  <a class="brand" href="../index.html">⌁ 30 Days of DSA — JS</a>
  <nav><a href="index.html">← Problem Bank</a></nav>
</header>

<main class="container">
  <div class="card prereq-banner">
    <p>📚 <strong>Builds on <a href="../lessons/day29.html">Day 29: Mock Interview Day</a></strong>
      (Merge Intervals) — read that problem first if the sort-then-merge idea is new.</p>
  </div>

  <p class="mono" style="color:var(--text-dim);font-size:0.85rem;">INTERVALS &middot; MEDIUM</p>
  <h1>Insert Interval <span class="leetcode-link">(<a href="https://leetcode.com/problems/insert-interval/" target="_blank" rel="noopener">LeetCode: Insert Interval</a>)</span></h1>

  <h2>The problem</h2>
  <p>You're given a list of non-overlapping intervals, already sorted by start time, plus one new
    interval. Insert the new interval into the list, merging any overlapping intervals so the
    result stays sorted and non-overlapping.</p>

  <h2>Solution 1: Brute force — concat, sort, general merge</h2>
  <p>If you forget (or don't trust) that the input is already sorted, the safe fallback is: append
    the new interval to the list, sort everything by start time, then run the same general
    Merge Intervals scan from Day 29. It's correct, but the sort is pure waste — the list was
    already sorted before the new interval showed up.</p>

  <svg class="diagram" viewBox="0 0 640 170" role="img" aria-label="Flow diagram: existing sorted intervals plus the new interval are concatenated, then sorted by start time, then run through a general merge-intervals scan to produce the final result.">
    <text x="20" y="26" font-size="13" fill="#61AEEE" font-weight="bold">Brute force: concat, sort, then general merge scan</text>
    <g font-family="var(--font-head)" font-size="12" text-anchor="middle">
      <rect x="20" y="60" width="130" height="46" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="85" y="88" fill="#E2E3E7">concat new</text>
      <rect x="180" y="60" width="130" height="46" rx="6" fill="#E6C07B" stroke="#21252B"/>
      <text x="245" y="88" fill="#282C34">sort by start</text>
      <rect x="340" y="60" width="130" height="46" rx="6" fill="#98C379" stroke="#21252B"/>
      <text x="405" y="88" fill="#282C34">merge scan</text>
      <rect x="500" y="60" width="120" height="46" rx="6" fill="#61AEEE" stroke="#21252B"/>
      <text x="560" y="88" fill="#282C34">result</text>
    </g>
    <defs>
      <marker id="arrow-flow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#9198A6"/>
      </marker>
    </defs>
    <g stroke="#9198A6" stroke-width="1.5" fill="none" marker-end="url(#arrow-flow)">
      <line x1="150" y1="83" x2="178" y2="83"/>
      <line x1="310" y1="83" x2="338" y2="83"/>
      <line x1="470" y1="83" x2="498" y2="83"/>
    </g>
    <text x="20" y="140" font-size="12" fill="#E06C75">Cost: O(n log n) — the sort is the bottleneck, and it's entirely avoidable.</text>
  </svg>

  <h3>Interactive visualization</h3>
  <div class="legend">
    <span><i class="lg-active"></i> the new interval</span>
    <span><i class="lg-sorted"></i> in the result</span>
  </div>
  <div class="viz-panel">
    <div class="viz-stage"><div id="viz1Stage"></div></div>
    <div class="narration" id="viz1Narration">Press Play or Step to begin.</div>
    <div class="viz-controls">
      <button class="btn btn-primary" id="viz1Play">▶ Play</button>
      <button class="btn" id="viz1Step">Step ⏭</button>
      <button class="btn" id="viz1Reset">⟲ Reset</button>
      <button class="btn" id="viz1Shuffle">🔀 Shuffle</button>
      <span class="viz-counter" id="viz1Counter"></span>
    </div>
  </div>

  <h3>The code</h3>
  <pre><code>function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const result = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = sorted[i];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      result.push([start, end]);
    }
  }
  return result;
}

function insertBruteForce(intervals, newInterval) {
  return mergeIntervals(intervals.concat([newInterval]));
}</code></pre>
  <p><strong>Line by line:</strong></p>
  <ul>
    <li><code>intervals.concat([newInterval])</code> — the new interval is just another entry now,
      no different treatment from any existing one.</li>
    <li><code>.sort((a, b) => a[0] - b[0])</code> re-sorts everything by start time. This is the
      wasted work — the original <code>intervals</code> array was already in this order.</li>
    <li>The merge loop is identical to Day 29's Merge Intervals — <code>start &lt;= last[1]</code>
      extends the running merged interval, otherwise a new one starts.</li>
  </ul>

  <h3>Complexity</h3>
  <table class="complexity-table">
    <thead><tr><th>Time</th><th>Space</th><th>Approach</th></tr></thead>
    <tbody><tr><td>O(n log n)</td><td>O(n)</td><td>Sort + one linear merge pass</td></tr></tbody>
  </table>

  <h2>Solution 2: Optimal — one linear pass, no sort</h2>
  <p>Since <code>intervals</code> is guaranteed already sorted and non-overlapping, walk it once
    in three phases: copy every interval that ends before the new one starts, absorb every
    interval that overlaps the new one (growing it), then copy everything left over. No sort
    needed anywhere.</p>

  <svg class="diagram" viewBox="0 0 640 170" role="img" aria-label="Flow diagram of the optimal one-pass solution: phase 1 copies intervals ending before the new interval starts, phase 2 absorbs overlapping intervals into the new interval, phase 3 copies remaining intervals - no sort needed since the input is already sorted.">
    <text x="20" y="26" font-size="13" fill="#61AEEE" font-weight="bold">Optimal: one linear pass, three phases, no sort</text>
    <g font-family="var(--font-head)" font-size="12" text-anchor="middle">
      <rect x="20" y="60" width="180" height="46" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="110" y="82" fill="#E2E3E7">before: end &lt; new.start</text>
      <text x="110" y="98" fill="#9198A6" font-size="10">copy as-is</text>
      <rect x="220" y="60" width="180" height="46" rx="6" fill="#C678DD" stroke="#21252B"/>
      <text x="310" y="82" fill="#282C34">overlap: start &le; new.end</text>
      <text x="310" y="98" fill="#282C34" font-size="10">absorb into newInterval</text>
      <rect x="420" y="60" width="180" height="46" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="510" y="82" fill="#E2E3E7">after: everything left</text>
      <text x="510" y="98" fill="#9198A6" font-size="10">copy as-is</text>
    </g>
    <text x="20" y="140" font-size="12" fill="#98C379">Cost: O(n) — every interval is looked at exactly once, no sort.</text>
  </svg>

  <h3>Interactive visualization</h3>
  <div class="legend">
    <span><i class="lg-active"></i> newInterval, growing as it absorbs overlaps</span>
    <span><i class="lg-sorted"></i> finalized in the result</span>
  </div>
  <div class="viz-panel">
    <div class="viz-stage"><div id="viz2Stage"></div></div>
    <div class="narration" id="viz2Narration">Press Play or Step to begin.</div>
    <div class="viz-controls">
      <button class="btn btn-primary" id="viz2Play">▶ Play</button>
      <button class="btn" id="viz2Step">Step ⏭</button>
      <button class="btn" id="viz2Reset">⟲ Reset</button>
      <span class="viz-counter" id="viz2Counter"></span>
    </div>
  </div>

  <h3>The code</h3>
  <pre><code>function insertOptimal(intervals, newInterval) {
  const result = [];
  let i = 0;
  const n = intervals.length;
  let [ns, ne] = newInterval;

  // Phase 1: intervals ending strictly before the new interval starts — copy as-is.
  while (i < n && intervals[i][1] < ns) {
    result.push(intervals[i]);
    i++;
  }
  // Phase 2: intervals overlapping the new interval — absorb them into [ns, ne].
  while (i < n && intervals[i][0] <= ne) {
    ns = Math.min(ns, intervals[i][0]);
    ne = Math.max(ne, intervals[i][1]);
    i++;
  }
  result.push([ns, ne]);
  // Phase 3: everything after — copy as-is.
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }
  return result;
}</code></pre>
  <p><strong>Line by line:</strong></p>
  <ul>
    <li>Phase 1's condition <code>intervals[i][1] &lt; ns</code> — strictly less than, so a
      touching interval like <code>[1,2]</code> against a new interval starting at 2 correctly
      falls through to phase 2 instead of being copied untouched.</li>
    <li>Phase 2 grows <code>[ns, ne]</code> with <code>Math.min</code>/<code>Math.max</code> —
      the merged interval always covers everything it has absorbed so far.</li>
    <li>The merged <code>[ns, ne]</code> is pushed exactly once, right when phase 2 ends — there's
      no ambiguity about when merging stops, because the while condition itself is the stopping
      rule.</li>
    <li>Every interval is visited by exactly one phase — that's what makes this O(n) instead of
      O(n log n).</li>
  </ul>

  <h3>Complexity</h3>
  <table class="complexity-table">
    <thead><tr><th>Time</th><th>Space</th><th>Approach</th></tr></thead>
    <tbody><tr><td>O(n)</td><td>O(n)</td><td>3-phase linear scan, exploiting the sorted input</td></tr></tbody>
  </table>

  <h2>Complexity comparison</h2>
  <div style="overflow-x:auto;">
  <table class="complexity-table">
    <thead><tr><th>Solution</th><th>Time</th><th>Space</th></tr></thead>
    <tbody>
      <tr><td>Brute force (sort + general merge)</td><td>O(n log n)</td><td>O(n)</td></tr>
      <tr><td>Optimal (3-phase linear scan)</td><td>O(n)</td><td>O(n)</td></tr>
    </tbody>
  </table>
  </div>

  <h2>Quiz</h2>

  <div class="dsa-quiz" data-answer="sorted" data-explain="The problem guarantees intervals arrives already sorted by start time and non-overlapping — that precondition is exactly what the 3-phase scan relies on to skip sorting entirely.">
    <p class="q-text">1. Why can the optimal solution skip sorting entirely?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="sorted">intervals is guaranteed already sorted by start time as an input precondition</button>
      <button class="btn dsa-quiz-option" data-value="small">Sorting is only needed for inputs larger than 100 intervals</button>
      <button class="btn dsa-quiz-option" data-value="unnecessary">Sorting never matters for correctness in any interval problem</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="endstart" data-explain="Phase 1 keeps copying untouched intervals as long as they end strictly before newInterval starts. The moment an interval's end reaches or passes newInterval's start, it overlaps and phase 2 begins." >
    <p class="q-text">2. In the optimal 3-phase scan, what determines when the "before" phase ends and the "overlapping" phase begins?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="endstart">The current interval's end is no longer strictly less than newInterval's start</button>
      <button class="btn dsa-quiz-option" data-value="index">After exactly half the intervals have been checked</button>
      <button class="btn dsa-quiz-option" data-value="length">When the current interval is longer than newInterval</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="startend" data-explain="As soon as an interval's start is greater than the merged newInterval's current end, there's no more overlap left to absorb, so the merged interval is finalized and phase 3 begins." >
    <p class="q-text">3. What determines when the "overlapping" merge phase ends and the "after" phase begins?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="startend">The current interval's start is greater than the merged newInterval's end</button>
      <button class="btn dsa-quiz-option" data-value="always3">It always ends after exactly 3 intervals</button>
      <button class="btn dsa-quiz-option" data-value="never">It never ends — every remaining interval gets absorbed</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="generalcase" data-explain="Merge Intervals' general algorithm doesn't assume anything about how the input arrived — it just sorts and merges whatever it's given, so appending the new interval and re-sorting still produces a correct result, just with an avoidable extra sort." >
    <p class="q-text">4. Why does the brute-force sort+merge approach still work correctly even though it ignores the fact the input was already sorted?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="generalcase">Merge Intervals' general algorithm correctly handles any unsorted input, sorted or not</button>
      <button class="btn dsa-quiz-option" data-value="luck">It only happens to work on the examples shown here</button>
      <button class="btn dsa-quiz-option" data-value="doesnt">It doesn't — it silently produces wrong answers</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="sortcost" data-explain="Brute force is O(n log n), dominated entirely by the sort step. Optimal is O(n), a single pass with no sort — because the 3-phase scan exploits the guarantee that the input arrives already sorted." >
    <p class="q-text">5. What's the time complexity difference between the two solutions, and why?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="sortcost">Brute force O(n log n) from the sort; optimal O(n) with no sort needed</button>
      <button class="btn dsa-quiz-option" data-value="same">They're the same — O(n) for both</button>
      <button class="btn dsa-quiz-option" data-value="reversed">Brute force is O(n); optimal is O(n log n)</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="continue-row">
    <button class="btn btn-primary" id="completeBtn">Mark problem complete</button>
  </div>
  <div class="continue-row">
    <a class="btn" href="index.html">← Back to Problem Bank</a>
  </div>
</main>

<footer class="site-footer">
  30 Days of DSA in JavaScript — a personal study project.
</footer>

<script src="../js/problemBank.js"></script>
<script src="../js/problemBankProgress.js"></script>
<script src="../js/engine.js"></script>
<script>
  const SLUG = 'insert-interval';

  // ---- shared custom interval-span painter (mirrors lessons/day27.html's makeIntervalViz —
  // Bars' vertical-height metaphor doesn't fit intervals, so this paints horizontal span bars
  // on a shared number line instead, driven by the same DSA.StepPlayer engine). ----
  const IV_COLORS = {
    default: ['#3E4452', '#E2E3E7'],
    active: ['#C678DD', '#282C34'],
    sorted: ['#98C379', '#282C34'],
    swap: ['#E06C75', '#282C34'],
  };

  function makeIntervalViz(container) {
    container.style.position = 'relative';
    container.style.width = '100%';
    return {
      paint(step) {
        container.innerHTML = '';
        if (!step) { container.style.height = '90px'; return; }
        const { order, states, domainMax } = step;
        const rowH = 34, rowGap = 12, topPad = 40;
        container.style.height = (topPad + order.length * (rowH + rowGap) + 12) + 'px';

        const scalePct = (v) => 5 + (v / domainMax) * 90;

        const axis = document.createElement('div');
        axis.style.cssText = `position:absolute; left:5%; width:90%; top:${topPad - 12}px; height:1px; background:#3E4452;`;
        container.appendChild(axis);

        for (let v = 0; v <= domainMax; v++) {
          const tick = document.createElement('div');
          tick.style.cssText = `position:absolute; left:${scalePct(v)}%; top:${topPad - 28}px; transform:translateX(-50%); font-family:var(--font-head); font-size:10px; color:#9198A6; white-space:nowrap;`;
          tick.textContent = v;
          container.appendChild(tick);
        }

        order.forEach((iv, i) => {
          const [bg, fg] = IV_COLORS[states[i] || 'default'];
          const left = scalePct(iv[0]);
          const width = scalePct(iv[1]) - left;
          const bar = document.createElement('div');
          bar.style.cssText = `position:absolute; left:${left}%; width:${width}%; top:${topPad + i * (rowH + rowGap)}px; height:${rowH}px; background:${bg}; color:${fg}; border-radius:5px; display:flex; align-items:center; justify-content:center; font-family:var(--font-head); font-size:12px; font-weight:600; box-sizing:border-box;`;
          bar.textContent = `[${iv[0]}, ${iv[1]}]`;
          container.appendChild(bar);
        });
      },
    };
  }

  // ---- Solution 1: brute force (concat, sort, general merge) ----
  function buildInsertBruteSteps(intervals, newInterval) {
    const steps = [];
    const domainMax = Math.max.apply(null, intervals.map((iv) => iv[1]).concat([newInterval[1]])) + 1;

    const withNew = intervals.map((iv) => iv.slice());
    const newIdx = withNew.length;
    withNew.push(newInterval.slice());
    const states0 = withNew.map((_, i) => (i === newIdx ? 'active' : 'default'));
    steps.push({ narration: `${intervals.length} existing intervals plus the new interval [${newInterval[0]}, ${newInterval[1]}] (purple), appended at the end, unsorted.`, order: withNew.slice(), states: states0, domainMax });

    const tagged = withNew.map((iv, i) => ({ iv, isNew: i === newIdx }));
    tagged.sort((a, b) => a.iv[0] - b.iv[0]);
    const sorted = tagged.map((t) => t.iv);
    const isNewFlags = tagged.map((t) => t.isNew);
    const states1 = isNewFlags.map((f) => (f ? 'active' : 'default'));
    steps.push({ narration: `Sort all ${sorted.length} intervals by start time — this is the step the optimal solution skips.`, order: sorted.slice(), states: states1.slice(), domainMax });

    const result = [sorted[0].slice()];
    let display = [sorted[0].slice()];
    let displayStates = [isNewFlags[0] ? 'active' : 'sorted'];
    steps.push({ narration: `Start the general merge scan — first interval [${sorted[0][0]}, ${sorted[0][1]}] opens the result.`, order: display.slice(), states: displayStates.slice(), domainMax });

    for (let i = 1; i < sorted.length; i++) {
      const [start, end] = sorted[i];
      const last = result[result.length - 1];
      if (start <= last[1]) {
        last[1] = Math.max(last[1], end);
        display = result.concat(sorted.slice(i + 1));
        displayStates = result.map(() => 'sorted').concat(sorted.slice(i + 1).map(() => 'default'));
        steps.push({ narration: `[${start}, ${end}] overlaps the last result interval — extend it to [${last[0]}, ${last[1]}].`, order: display.slice(), states: displayStates.slice(), domainMax });
      } else {
        result.push([start, end]);
        display = result.concat(sorted.slice(i + 1));
        displayStates = result.map(() => 'sorted').concat(sorted.slice(i + 1).map(() => 'default'));
        steps.push({ narration: `[${start}, ${end}] doesn't overlap — starts a new interval in the result.`, order: display.slice(), states: displayStates.slice(), domainMax });
      }
    }
    steps.push({ narration: `Done — result: ${result.map((iv) => `[${iv[0]}, ${iv[1]}]`).join(', ')}. Correct, but the sort cost O(n log n) that wasn't necessary.`, order: result.slice(), states: result.map(() => 'sorted'), domainMax });
    return steps;
  }

  // ---- Solution 2: optimal (3-phase linear scan, no sort) ----
  function buildInsertOptimalSteps(intervals, newInterval) {
    const steps = [];
    const domainMax = Math.max.apply(null, intervals.map((iv) => iv[1]).concat([newInterval[1]])) + 1;
    const result = [];
    let [ns, ne] = newInterval;
    let i = 0;
    const n = intervals.length;

    function snapshot(narration, includeOverlay) {
      const order = result.map((iv) => iv.slice());
      const states = result.map(() => 'sorted');
      if (includeOverlay) { order.push([ns, ne]); states.push('active'); }
      intervals.slice(i).forEach((iv) => { order.push(iv.slice()); states.push('default'); });
      steps.push({ narration, order, states, domainMax });
    }

    snapshot(`Start: newInterval is [${ns}, ${ne}] (purple). Walk the existing ${n} sorted intervals left to right — no sort needed.`, true);

    while (i < n && intervals[i][1] < ns) {
      const s = intervals[i][0], e = intervals[i][1];
      result.push([s, e]);
      i++;
      snapshot(`[${s}, ${e}] ended before newInterval starts — copied to the result as-is.`, true);
    }
    while (i < n && intervals[i][0] <= ne) {
      const s = intervals[i][0], e = intervals[i][1];
      ns = Math.min(ns, s);
      ne = Math.max(ne, e);
      i++;
      snapshot(`[${s}, ${e}] overlapped newInterval — absorbed it: newInterval grows to [${ns}, ${ne}].`, true);
    }
    result.push([ns, ne]);
    snapshot(`No more overlaps — the merged newInterval [${ns}, ${ne}] is pushed into the result.`, false);
    while (i < n) {
      const s = intervals[i][0], e = intervals[i][1];
      result.push([s, e]);
      i++;
      snapshot(`[${s}, ${e}] starts after newInterval ends — copied to the result as-is.`, false);
    }
    return steps;
  }

  function randomIntervalsAndNew() {
    const n = 3 + Math.floor(Math.random() * 2);
    const arr = [];
    let cursor = 0;
    for (let i = 0; i < n; i++) {
      cursor += 1 + Math.floor(Math.random() * 2);
      const len = 1 + Math.floor(Math.random() * 3);
      arr.push([cursor, cursor + len]);
      cursor += len;
    }
    const ni = Math.floor(Math.random() * n);
    const newInterval = [Math.max(0, arr[ni][0] - 1), arr[ni][1] + 1];
    return { intervals: arr, newInterval };
  }

  const intervalStage1 = document.getElementById('viz1Stage');
  const intervalViz1 = makeIntervalViz(intervalStage1);
  let bruteData = { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] };
  let bruteSteps = buildInsertBruteSteps(bruteData.intervals, bruteData.newInterval);
  const bruteplayer = new DSA.StepPlayer({
    steps: bruteSteps,
    narrationEl: document.getElementById('viz1Narration'),
    counterEl: document.getElementById('viz1Counter'),
    playBtn: document.getElementById('viz1Play'),
    stepBtn: document.getElementById('viz1Step'),
    resetBtn: document.getElementById('viz1Reset'),
    shuffleBtn: document.getElementById('viz1Shuffle'),
    speed: 1100,
    onStep(step) { intervalViz1.paint(step); },
    onShuffle() {
      bruteData = randomIntervalsAndNew();
      bruteSteps = buildInsertBruteSteps(bruteData.intervals, bruteData.newInterval);
      bruteplayer.setSteps(bruteSteps);
    },
  });

  const intervalStage2 = document.getElementById('viz2Stage');
  const intervalViz2 = makeIntervalViz(intervalStage2);
  const optimalSteps = buildInsertOptimalSteps([[1, 3], [6, 9]], [2, 5]);
  const optimalPlayer = new DSA.StepPlayer({
    steps: optimalSteps,
    narrationEl: document.getElementById('viz2Narration'),
    counterEl: document.getElementById('viz2Counter'),
    playBtn: document.getElementById('viz2Play'),
    stepBtn: document.getElementById('viz2Step'),
    resetBtn: document.getElementById('viz2Reset'),
    speed: 1100,
    onStep(step) { intervalViz2.paint(step); },
  });

  // ---- quiz + reveal wiring ----
  DSA.wireQuiz(document);
  DSA.wireReveals(document);

  // ---- mark complete ----
  const completeBtn = document.getElementById('completeBtn');
  function refreshCompleteBtn() {
    const done = ProblemBankProgress.isDone(SLUG);
    completeBtn.textContent = done ? '✓ Complete — click to undo' : 'Mark problem complete';
    completeBtn.classList.toggle('btn-done', done);
    completeBtn.classList.toggle('btn-primary', !done);
  }
  completeBtn.addEventListener('click', () => {
    ProblemBankProgress.toggle(SLUG);
    refreshCompleteBtn();
  });
  refreshCompleteBtn();
</script>
</body>
</html>
```

- [ ] **Step 3: Browser-verify**

Open `problem-bank/insert-interval.html` directly in a browser. Check:
- No console errors.
- Solution 1's animation: initial unsorted display (3 bars, new interval purple) → sort step reorders bars → merge scan steps extend/finalize bars → final state shows `[[1,5],[6,9]]` matching the node-verified output.
- Solution 2's animation: 3-phase walk produces the same final `[[1,5],[6,9]]`, without a visible "sort" step.
- Shuffle on Solution 1 regenerates a new random interval set and re-runs correctly (spot-check narration makes sense for at least 2 shuffles).
- Number-line diagrams don't overflow horizontally at ~390px width; bars stay within the axis.
- All 5 quiz questions give correct feedback.
- Mark-complete works and is isolated from `dsa-progress`.

Fix anything found before moving to Task 7.

- [ ] **Step 4: Commit**

```bash
git add problem-bank/insert-interval.html
git commit -m "add Insert Interval problem page"
```

---

### Task 7: `problem-bank/lru-cache.html`

**Files:**
- Create: `problem-bank/lru-cache.html`

**Interfaces:**
- Consumes: `js/engine.js` (`DSA.StepPlayer`, `DSA.Bars`, `DSA.Graph`, `DSA.wireQuiz`, `DSA.wireReveals`), `js/problemBankProgress.js`.
- Produces: nothing consumed elsewhere.

**Both solutions below are already node-verified.** Verification transcript:

```
node -e '
class LRUCacheArray {
  constructor(capacity) { this.capacity = capacity; this.cache = []; }
  get(key) {
    const idx = this.cache.findIndex(([k]) => k === key);
    if (idx === -1) return -1;
    const [, value] = this.cache[idx];
    this.cache.splice(idx, 1);
    this.cache.push([key, value]);
    return value;
  }
  put(key, value) {
    const idx = this.cache.findIndex(([k]) => k === key);
    if (idx !== -1) this.cache.splice(idx, 1);
    this.cache.push([key, value]);
    if (this.cache.length > this.capacity) this.cache.shift();
  }
}
class DListNode { constructor(key, value) { this.key = key; this.value = value; this.prev = null; this.next = null; } }
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; this.map = new Map();
    this.head = new DListNode(null, null); this.tail = new DListNode(null, null);
    this.head.next = this.tail; this.tail.prev = this.head;
  }
  _remove(node) { node.prev.next = node.next; node.next.prev = node.prev; }
  _insertAtFront(node) { node.next = this.head.next; node.prev = this.head; this.head.next.prev = node; this.head.next = node; }
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node); this._insertAtFront(node);
    return node.value;
  }
  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key); node.value = value;
      this._remove(node); this._insertAtFront(node);
      return;
    }
    const node = new DListNode(key, value);
    this.map.set(key, node); this._insertAtFront(node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev; this._remove(lru); this.map.delete(lru.key);
    }
  }
}
function runSequence(CacheClass) {
  const cache = new CacheClass(2); const out = [];
  cache.put(1, 1); cache.put(2, 2);
  out.push(cache.get(1));
  cache.put(3, 3);
  out.push(cache.get(2));
  cache.put(4, 4);
  out.push(cache.get(1));
  out.push(cache.get(3));
  out.push(cache.get(4));
  return out;
}
console.log("Array-based:", runSequence(LRUCacheArray));
console.log("Map+DLL    :", runSequence(LRUCache));
'
```
Output (matches LeetCode's canonical example for both solutions):
```
Array-based: [ 1, -1, -1, 3, 4 ]
Map+DLL    : [ 1, -1, -1, 3, 4 ]
```

- [ ] **Step 1: Re-run the verification command above**

Confirm both lines print `[ 1, -1, -1, 3, 4 ]` before writing any HTML.

- [ ] **Step 2: Write the file**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LRU Cache — Problem Bank</title>
<meta name="description" content="LRU Cache: a brute-force O(n) array solution vs. an optimal O(1) Map + doubly linked list, both animated, with full line-by-line code." />
<link rel="canonical" href="https://dsa.itszain.tech/problem-bank/lru-cache.html" />
<meta property="og:type" content="website" />
<meta property="og:title" content="LRU Cache — Problem Bank" />
<meta property="og:description" content="LRU Cache: a brute-force O(n) array solution vs. an optimal O(1) Map + doubly linked list, both animated, with full line-by-line code." />
<meta property="og:url" content="https://dsa.itszain.tech/problem-bank/lru-cache.html" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="LRU Cache — Problem Bank" />
<meta name="twitter:description" content="LRU Cache: a brute-force O(n) array solution vs. an optimal O(1) Map + doubly linked list, both animated, with full line-by-line code." />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23282C34'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='%2361AEEE'%3E%E2%8C%81%3C/text%3E%3C/svg%3E" />
<link rel="stylesheet" href="../css/style.css" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "30 Days of DSA in JavaScript", "item": "https://dsa.itszain.tech/" },
    { "@type": "ListItem", "position": 2, "name": "Problem Bank", "item": "https://dsa.itszain.tech/problem-bank/index.html" },
    { "@type": "ListItem", "position": 3, "name": "LRU Cache", "item": "https://dsa.itszain.tech/problem-bank/lru-cache.html" }
  ]
}
</script>
</head>
<body>
<header class="site-header">
  <a class="brand" href="../index.html">⌁ 30 Days of DSA — JS</a>
  <nav><a href="index.html">← Problem Bank</a></nav>
</header>

<main class="container">
  <div class="card prereq-banner">
    <p>📚 <strong>Builds on <a href="../lessons/day15.html">Day 15: Linked Lists</a></strong> —
      the optimal solution below is a doubly linked list with node pointers moved by hand; read
      that lesson first if pointer manipulation is still new.</p>
  </div>

  <p class="mono" style="color:var(--text-dim);font-size:0.85rem;">DESIGN &middot; MEDIUM</p>
  <h1>LRU Cache <span class="leetcode-link">(<a href="https://leetcode.com/problems/lru-cache/" target="_blank" rel="noopener">LeetCode: LRU Cache</a>)</span></h1>

  <h2>The problem</h2>
  <p>Design a fixed-capacity cache supporting <code>get(key)</code> and
    <code>put(key, value)</code>, both ideally O(1). When the cache is full and a new key is
    inserted, evict the <strong>least-recently-used</strong> entry — the one that hasn't been read
    or written the longest.</p>

  <h2>Solution 1: Brute force — a plain array</h2>
  <p>Keep entries in one array, ordered from least-recently-used (front) to most-recently-used
    (end). Every <code>get</code> or <code>put</code> that touches an existing key has to scan the
    array to find it, then move it to the end.</p>

  <svg class="diagram" viewBox="0 0 640 200" role="img" aria-label="Diagram of the brute-force LRU cache: a plain array of key-value pairs in least-to-most-recently-used order. get and put both need a linear scan to locate a key, then splice it out and push it to the end to mark it most recently used.">
    <text x="20" y="26" font-size="13" fill="#61AEEE" font-weight="bold">Brute force: a plain array, ordered LRU &rarr; MRU</text>
    <text x="20" y="45" font-size="10" fill="#9198A6">&larr; least recently used</text>
    <text x="320" y="45" font-size="10" fill="#9198A6" text-anchor="end">most recently used &rarr;</text>
    <g font-family="var(--font-head)" font-size="13" text-anchor="middle">
      <rect x="20" y="55" width="90" height="40" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="65" y="79" fill="#E2E3E7">1:1</text>
      <rect x="120" y="55" width="90" height="40" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="165" y="79" fill="#E2E3E7">2:2</text>
      <rect x="220" y="55" width="90" height="40" rx="6" fill="#3E4452" stroke="#21252B"/>
      <text x="265" y="79" fill="#E2E3E7">3:3</text>
    </g>
    <text x="20" y="130" font-size="12" fill="#DCDFE4">get(1) has to scan from the front to find key 1 — O(n) — then splice it out</text>
    <text x="20" y="148" font-size="12" fill="#DCDFE4">and push it to the end to mark it as just-used, also O(n) for the shift.</text>
    <text x="20" y="180" font-size="12" fill="#E06C75">Cost: O(n) per get/put.</text>
  </svg>

  <h3>Interactive visualization</h3>
  <div class="legend">
    <span><i class="lg-compare"></i> scanning</span>
    <span><i class="lg-swap"></i> found</span>
    <span><i class="lg-sorted"></i> most recently used</span>
  </div>
  <div class="viz-panel">
    <div class="viz-stage"><div id="viz1Stage"></div></div>
    <div class="narration" id="viz1Narration">Press Play or Step to begin.</div>
    <div class="viz-controls">
      <button class="btn btn-primary" id="viz1Play">▶ Play</button>
      <button class="btn" id="viz1Step">Step ⏭</button>
      <button class="btn" id="viz1Reset">⟲ Reset</button>
      <span class="viz-counter" id="viz1Counter"></span>
    </div>
  </div>
  <p style="color:var(--text-dim);font-size:0.85rem;">This animation traces the exact sequence
    verified above, capacity 2: put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1),
    get(3), get(4).</p>

  <h3>The code</h3>
  <pre><code>class LRUCacheArray {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = []; // [key, value] pairs, front = LRU, end = MRU
  }
  get(key) {
    const idx = this.cache.findIndex(([k]) => k === key);
    if (idx === -1) return -1;
    const [, value] = this.cache[idx];
    this.cache.splice(idx, 1);
    this.cache.push([key, value]);
    return value;
  }
  put(key, value) {
    const idx = this.cache.findIndex(([k]) => k === key);
    if (idx !== -1) this.cache.splice(idx, 1);
    this.cache.push([key, value]);
    if (this.cache.length > this.capacity) this.cache.shift();
  }
}</code></pre>
  <p><strong>Line by line:</strong></p>
  <ul>
    <li><code>findIndex</code> is the O(n) cost — every <code>get</code>/<code>put</code> on an
      existing key scans from the front.</li>
    <li><code>get</code> splices the found entry out, then pushes it back at the end — that's
      what marks it most-recently-used.</li>
    <li><code>put</code> on an existing key removes the old entry first so the fresh
      <code>push</code> doesn't leave a stale duplicate.</li>
    <li><code>this.cache.shift()</code> evicts index 0 — by construction, the entry that's been
      sitting at the front longest without being touched.</li>
  </ul>

  <h3>Complexity</h3>
  <table class="complexity-table">
    <thead><tr><th>get</th><th>put</th><th>Space</th></tr></thead>
    <tbody><tr><td>O(n)</td><td>O(n)</td><td>O(capacity)</td></tr></tbody>
  </table>

  <h2>Solution 2: Optimal — Map + doubly linked list</h2>
  <p>Keep a doubly linked list ordered by recency (most-recently-used near a HEAD sentinel,
    least-recently-used near a TAIL sentinel), plus a <code>Map</code> from key straight to its
    list node. The Map turns "find this key" from an O(n) scan into an O(1) lookup; the linked
    list turns "move this node to the front" and "remove the last real node" into O(1) pointer
    updates.</p>

  <svg class="diagram" viewBox="0 0 640 220" role="img" aria-label="Diagram of the optimal LRU cache: a doubly linked list with head and tail sentinel nodes, most-recently-used near the head and least-recently-used near the tail, plus a Map from key to its list node for O(1) lookup.">
    <text x="20" y="26" font-size="13" fill="#61AEEE" font-weight="bold">Optimal: Map (key &rarr; node) + doubly linked list (recency order)</text>
    <g stroke="#3E4452" stroke-width="2">
      <line x1="60" y1="100" x2="150" y2="100"/>
      <line x1="150" y1="100" x2="240" y2="100"/>
      <line x1="240" y1="100" x2="330" y2="100"/>
      <line x1="330" y1="100" x2="420" y2="100"/>
    </g>
    <g font-family="var(--font-head)" font-size="11" text-anchor="middle">
      <rect x="32" y="86" width="56" height="28" rx="4" fill="#282C34" stroke="#61AEEE"/>
      <text x="60" y="104" fill="#61AEEE" font-size="10">HEAD</text>
      <circle cx="150" cy="100" r="18" fill="#98C379"/>
      <text x="150" y="104" fill="#282C34" font-size="12">3:3</text>
      <circle cx="240" cy="100" r="18" fill="#3E4452"/>
      <text x="240" y="104" fill="#E2E3E7" font-size="12">1:1</text>
      <circle cx="330" cy="100" r="18" fill="#3E4452"/>
      <text x="330" y="104" fill="#E2E3E7" font-size="12">2:2</text>
      <rect x="392" y="86" width="56" height="28" rx="4" fill="#282C34" stroke="#61AEEE"/>
      <text x="420" y="104" fill="#61AEEE" font-size="10">TAIL</text>
    </g>
    <text x="150" y="140" font-size="10" fill="#98C379" text-anchor="middle">most recently used</text>
    <text x="330" y="140" font-size="10" fill="#E06C75" text-anchor="middle">evicted first</text>
    <text x="20" y="180" font-size="12" fill="#DCDFE4">Map.get(key) jumps straight to a node — no scanning — and moving a node</text>
    <text x="20" y="198" font-size="12" fill="#DCDFE4">to the front (or evicting the one before TAIL) is O(1) pointer surgery.</text>
  </svg>

  <h3>Interactive visualization</h3>
  <div class="legend">
    <span><i class="lg-active"></i> new node inserted</span>
    <span><i class="lg-pointer"></i> Map lookup hit</span>
    <span><i class="lg-sorted"></i> moved to most-recently-used</span>
  </div>
  <div class="viz-panel">
    <div class="viz-stage"><div id="viz2Stage"></div></div>
    <div class="narration" id="viz2Narration">Press Play or Step to begin.</div>
    <div class="viz-controls">
      <button class="btn btn-primary" id="viz2Play">▶ Play</button>
      <button class="btn" id="viz2Step">Step ⏭</button>
      <button class="btn" id="viz2Reset">⟲ Reset</button>
      <span class="viz-counter" id="viz2Counter"></span>
    </div>
  </div>
  <p style="color:var(--text-dim);font-size:0.85rem;">Same operation sequence as Solution 1 —
    watch the front of the chain track "most recently used" without ever scanning.</p>

  <h3>The code</h3>
  <pre><code>class DListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DListNode(null, null); // sentinel, most-recent side
    this.tail = new DListNode(null, null); // sentinel, least-recent side
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  _insertAtFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._insertAtFront(node);
    return node.value;
  }
  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._remove(node);
      this._insertAtFront(node);
      return;
    }
    const node = new DListNode(key, value);
    this.map.set(key, node);
    this._insertAtFront(node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}</code></pre>
  <p><strong>Line by line:</strong></p>
  <ul>
    <li>Two sentinel nodes (<code>head</code>, <code>tail</code>) remove every edge case around
      an empty list or a size-1 list — there's always a real <code>prev</code>/<code>next</code>
      to link against.</li>
    <li><code>_remove</code> only needs the node itself (not a predecessor lookup) because every
      real node's <code>prev</code>/<code>next</code> pointers are always kept valid.</li>
    <li><code>this.map.has(key)</code> is the O(1) replacement for the array solution's
      <code>findIndex</code> — direct hash lookup instead of a scan.</li>
    <li>Eviction reads <code>this.tail.prev</code> — with the sentinel tail, that's always the
      real least-recently-used node, never <code>undefined</code>.</li>
  </ul>

  <h3>Complexity</h3>
  <table class="complexity-table">
    <thead><tr><th>get</th><th>put</th><th>Space</th></tr></thead>
    <tbody><tr><td>O(1)</td><td>O(1)</td><td>O(capacity)</td></tr></tbody>
  </table>

  <h2>Complexity comparison</h2>
  <div style="overflow-x:auto;">
  <table class="complexity-table">
    <thead><tr><th>Solution</th><th>get</th><th>put</th><th>Space</th></tr></thead>
    <tbody>
      <tr><td>Brute force (array)</td><td>O(n)</td><td>O(n)</td><td>O(capacity)</td></tr>
      <tr><td>Optimal (Map + doubly linked list)</td><td>O(1)</td><td>O(1)</td><td>O(capacity)</td></tr>
    </tbody>
  </table>
  </div>

  <h2>Quiz</h2>

  <div class="dsa-quiz" data-answer="scan" data-explain="Both get and put need to locate a key first, and a plain array has no faster way to do that than findIndex — an O(n) linear scan in the worst case." >
    <p class="q-text">1. Why is the array-based solution O(n) per operation?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="scan">get/put both need findIndex, an O(n) scan, to locate the key</button>
      <button class="btn dsa-quiz-option" data-value="sortcost">Arrays require sorting before every access</button>
      <button class="btn dsa-quiz-option" data-value="alwaysfast">It isn't — array access is always O(1)</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="removeinsert" data-explain="A doubly linked list makes both removing a node from anywhere and inserting a node at the front O(1), because every node holds direct pointers to its neighbors — no shifting or scanning required, unlike an array." >
    <p class="q-text">2. What two operations does the doubly linked list make O(1) that an array can't?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="removeinsert">Removing a node from anywhere, and inserting a node at the front</button>
      <button class="btn dsa-quiz-option" data-value="sorting">Sorting the whole list by key</button>
      <button class="btn dsa-quiz-option" data-value="searching">Searching for a value directly, without a Map</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="lookup" data-explain="The linked list alone can't jump to a key's node without walking from head or tail — that's still O(n). The Map is what supplies the O(1) key-to-node lookup that makes the whole design fast." >
    <p class="q-text">3. Why is a Map required in addition to the doubly linked list?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="lookup">Without it, finding a node by key would still require an O(n) list walk</button>
      <button class="btn dsa-quiz-option" data-value="capacity">The Map is what enforces the capacity limit</button>
      <button class="btn dsa-quiz-option" data-value="notneeded">It isn't required — the linked list alone is already O(1)</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="beforetail" data-explain="tail.prev is always the real node sitting closest to the TAIL sentinel — by construction, that's the least-recently-used entry, since every access moves a node to the front instead." >
    <p class="q-text">4. When the cache is full and a new key is inserted, which node gets evicted?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="beforetail">The node just before the TAIL sentinel — the least-recently-used entry</button>
      <button class="btn dsa-quiz-option" data-value="afterhead">The node just after the HEAD sentinel</button>
      <button class="btn dsa-quiz-option" data-value="random">A randomly chosen node</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="dsa-quiz" data-answer="recency" data-explain="LRU tracks recency of access, not just insertion — get() moves the accessed node to the front exactly like put() does, so a recently-read key isn't the next one evicted just because it wasn't recently written." >
    <p class="q-text">5. Why does <code>get()</code> also count as "using" a key for LRU purposes?</p>
    <div class="dsa-quiz-options">
      <button class="btn dsa-quiz-option" data-value="recency">LRU tracks recency of access, and get() moves the node to the front just like put() does</button>
      <button class="btn dsa-quiz-option" data-value="doesnt">It doesn't — only put() affects eviction order</button>
      <button class="btn dsa-quiz-option" data-value="capacityreset">get() resets the cache's capacity counter</button>
    </div>
    <p class="dsa-quiz-feedback" hidden></p>
  </div>

  <div class="continue-row">
    <button class="btn btn-primary" id="completeBtn">Mark problem complete</button>
  </div>
  <div class="continue-row">
    <a class="btn" href="index.html">← Back to Problem Bank</a>
  </div>
</main>

<footer class="site-footer">
  30 Days of DSA in JavaScript — a personal study project.
</footer>

<script src="../js/problemBank.js"></script>
<script src="../js/problemBankProgress.js"></script>
<script src="../js/engine.js"></script>
<script>
  const SLUG = 'lru-cache';
  const OPS = [
    { type: 'put', key: 1, value: 1 },
    { type: 'put', key: 2, value: 2 },
    { type: 'get', key: 1 },
    { type: 'put', key: 3, value: 3 },
    { type: 'get', key: 2 },
    { type: 'put', key: 4, value: 4 },
    { type: 'get', key: 1 },
    { type: 'get', key: 3 },
    { type: 'get', key: 4 },
  ];
  const CAPACITY = 2;

  // ---- Solution 1: brute-force array (DSA.Bars, uniform — "key:value" labels) ----
  function buildLRUArraySteps(capacity, ops) {
    const steps = [];
    let cache = []; // front = LRU, end = MRU

    function snapshot(narration, states) {
      const labels = cache.map(([k, v]) => `${k}:${v}`);
      steps.push({ narration, data: labels, states: states || labels.map(() => 'default') });
    }

    snapshot(`Cache created with capacity ${capacity}. Empty.`);

    ops.forEach((op) => {
      if (op.type === 'put') {
        const idx = cache.findIndex(([k]) => k === op.key);
        if (idx !== -1) {
          snapshot(`put(${op.key}, ${op.value}) — key ${op.key} found at position ${idx} during the scan.`, cache.map((_, i) => (i === idx ? 'compare' : 'default')));
          cache.splice(idx, 1);
        } else {
          snapshot(`put(${op.key}, ${op.value}) — key ${op.key} not found, scanned all ${cache.length} entries.`, cache.map(() => 'compare'));
        }
        cache.push([op.key, op.value]);
        if (cache.length > capacity) {
          const evicted = cache.shift();
          snapshot(`Over capacity — evict [${evicted[0]}:${evicted[1]}], the least-recently-used entry at the front.`, cache.map((_, i) => (i === cache.length - 1 ? 'sorted' : 'default')));
        } else {
          snapshot(`[${op.key}:${op.value}] pushed to the end — now the most-recently-used entry.`, cache.map((_, i) => (i === cache.length - 1 ? 'sorted' : 'default')));
        }
      } else {
        const idx = cache.findIndex(([k]) => k === op.key);
        if (idx === -1) {
          snapshot(`get(${op.key}) — scanned all ${cache.length} entries, not found. Returns -1.`, cache.map(() => 'compare'));
        } else {
          const value = cache[idx][1];
          snapshot(`get(${op.key}) — found at position ${idx} after scanning. Returns ${value}.`, cache.map((_, i) => (i === idx ? 'swap' : 'default')));
          cache.splice(idx, 1);
          cache.push([op.key, value]);
          snapshot(`[${op.key}:${value}] moved to the end — now the most-recently-used entry.`, cache.map((_, i) => (i === cache.length - 1 ? 'sorted' : 'default')));
        }
      }
    });

    return steps;
  }

  const bars1 = new DSA.Bars(document.getElementById('viz1Stage'), { uniform: true });
  bars1.setData([]);
  const steps1 = buildLRUArraySteps(CAPACITY, OPS);
  const player1 = new DSA.StepPlayer({
    steps: steps1,
    narrationEl: document.getElementById('viz1Narration'),
    counterEl: document.getElementById('viz1Counter'),
    playBtn: document.getElementById('viz1Play'),
    stepBtn: document.getElementById('viz1Step'),
    resetBtn: document.getElementById('viz1Reset'),
    speed: 1000,
    onStep(step) {
      if (!step) { bars1.setData([]); return; }
      bars1.setData(step.data);
      bars1.paint(step.states);
    },
  });

  // ---- Solution 2: optimal Map + doubly linked list (DSA.Graph, re-laid-out per step) ----
  const LRU_SLOT_X = (i) => 90 + i * 100;
  const LRU_ROW_Y = 100;

  function lruChainEdges(nodes) {
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) edges.push({ from: nodes[i].id, to: nodes[i + 1].id, directed: true });
    return edges;
  }

  function buildLRUOptimalSteps(capacity, ops) {
    const steps = [];
    let chain = []; // chain[0] = most recently used ... chain[last] = least recently used
    let counter = 0;
    const byKey = new Map();

    function relayout() {
      chain.forEach((n, i) => { n.x = LRU_SLOT_X(i); n.y = LRU_ROW_Y; });
    }

    function pushStep(narration, states) {
      relayout();
      steps.push({ narration, nodes: chain.map((n) => Object.assign({}, n)), edges: lruChainEdges(chain), states: states || {} });
    }

    pushStep(`Cache created with capacity ${capacity}. Empty — HEAD and TAIL point at each other.`);

    ops.forEach((op) => {
      if (op.type === 'put') {
        const existing = byKey.get(op.key);
        if (existing) {
          existing.label = `${op.key}:${op.value}`;
          chain = chain.filter((n) => n !== existing);
          chain.unshift(existing);
          pushStep(`put(${op.key}, ${op.value}) — key ${op.key} exists (Map lookup, O(1)). Update its value and move it to the front.`, { [existing.id]: 'sorted' });
        } else {
          const node = { id: 'n' + counter++, key: op.key, label: `${op.key}:${op.value}` };
          byKey.set(op.key, node);
          chain.unshift(node);
          pushStep(`put(${op.key}, ${op.value}) — new key. Insert a node at the front (most recently used).`, { [node.id]: 'active' });
          if (chain.length > capacity) {
            const evicted = chain.pop();
            byKey.delete(evicted.key);
            pushStep(`Over capacity — evict [${evicted.label}] from just before TAIL, the least-recently-used entry.`, {});
          }
        }
      } else {
        const node = byKey.get(op.key);
        if (!node) {
          pushStep(`get(${op.key}) — Map lookup finds nothing. Returns -1.`, {});
        } else {
          pushStep(`get(${op.key}) — Map lookup jumps straight to the node (O(1)). Returns ${node.label.split(':')[1]}.`, { [node.id]: 'pointer' });
          chain = chain.filter((n) => n !== node);
          chain.unshift(node);
          pushStep(`Move [${node.label}] to the front — it's now the most-recently-used entry.`, { [node.id]: 'sorted' });
        }
      }
    });

    return steps;
  }

  function paintLRUGraph(graph, step) {
    graph.nodes = step.nodes;
    graph.edges = step.edges;
    graph.render(step.states || {});
  }

  const graph2 = new DSA.Graph(document.getElementById('viz2Stage'), { width: 500, height: 180 });
  const steps2 = buildLRUOptimalSteps(CAPACITY, OPS);
  const player2 = new DSA.StepPlayer({
    steps: steps2,
    narrationEl: document.getElementById('viz2Narration'),
    counterEl: document.getElementById('viz2Counter'),
    playBtn: document.getElementById('viz2Play'),
    stepBtn: document.getElementById('viz2Step'),
    resetBtn: document.getElementById('viz2Reset'),
    speed: 1000,
    onStep(step) { paintLRUGraph(graph2, step || steps2[0]); },
  });
  paintLRUGraph(graph2, steps2[0]);

  // ---- quiz + reveal wiring ----
  DSA.wireQuiz(document);
  DSA.wireReveals(document);

  // ---- mark complete ----
  const completeBtn = document.getElementById('completeBtn');
  function refreshCompleteBtn() {
    const done = ProblemBankProgress.isDone(SLUG);
    completeBtn.textContent = done ? '✓ Complete — click to undo' : 'Mark problem complete';
    completeBtn.classList.toggle('btn-done', done);
    completeBtn.classList.toggle('btn-primary', !done);
  }
  completeBtn.addEventListener('click', () => {
    ProblemBankProgress.toggle(SLUG);
    refreshCompleteBtn();
  });
  refreshCompleteBtn();
</script>
</body>
</html>
```

- [ ] **Step 3: Browser-verify**

Open `problem-bank/lru-cache.html` directly in a browser. Check:
- No console errors.
- Solution 1's animation traces exactly: put(1,1), put(2,2), get(1)→1, put(3,3) evicts key 2, get(2)→-1, put(4,4) evicts key 1, get(1)→-1, get(3)→3, get(4)→4 — matching the node-verified sequence.
- Solution 2's animation produces the identical eviction/return sequence via the graph (chain reordering at the front, pop from the back on eviction), with no node/edge overlapping the SVG bounds (`width:500,height:180` — node centers at `LRU_SLOT_X(i)=90+i*100`; with at most `capacity=2` real nodes ever shown, max x is 190, well within bounds).
- Both diagrams render cleanly at ~390px mobile width.
- All 5 quiz questions give correct feedback.
- Mark-complete works and is isolated from `dsa-progress`.

Fix anything found.

- [ ] **Step 4: Commit**

```bash
git add problem-bank/lru-cache.html
git commit -m "add LRU Cache problem page"
```

---

### Task 8: Final cross-page verification and NOTES.md update

**Files:**
- Modify: `.docs/NOTES.md`

**Interfaces:**
- Consumes: nothing new — this is a verification and documentation task, no new interfaces produced.

- [ ] **Step 1: Re-run every node verification command from Tasks 5, 6, 7 in one pass**

```bash
node -e '
// Trie
class TrieBruteForce { constructor(){this.words=new Set();} insert(w){this.words.add(w);} search(w){return this.words.has(w);} startsWith(p){for(const w of this.words){if(w.startsWith(p))return true;}return false;} }
class TrieNode { constructor(){this.children=new Map();this.isWord=false;} }
class Trie { constructor(){this.root=new TrieNode();} insert(word){let node=this.root;for(const ch of word){if(!node.children.has(ch))node.children.set(ch,new TrieNode());node=node.children.get(ch);}node.isWord=true;} _walk(str){let node=this.root;for(const ch of str){if(!node.children.has(ch))return null;node=node.children.get(ch);}return node;} search(word){const n=this._walk(word);return n!==null&&n.isWord;} startsWith(p){return this._walk(p)!==null;} }
function runTrie(C){const t=new C();const o=[];t.insert("apple");o.push(t.search("apple"));o.push(t.search("app"));o.push(t.startsWith("app"));t.insert("app");o.push(t.search("app"));return o;}
console.log("Trie brute:", runTrie(TrieBruteForce));
console.log("Trie optimal:", runTrie(Trie));

// Insert Interval
function mergeIntervals(iv){if(iv.length===0)return[];const s=iv.slice().sort((a,b)=>a[0]-b[0]);const r=[s[0].slice()];for(let i=1;i<s.length;i++){const last=r[r.length-1];const[st,en]=s[i];if(st<=last[1])last[1]=Math.max(last[1],en);else r.push([st,en]);}return r;}
function insertBrute(iv,ni){return mergeIntervals(iv.concat([ni]));}
function insertOptimal(iv,ni){const r=[];let i=0;const n=iv.length;let[ns,ne]=ni;while(i<n&&iv[i][1]<ns){r.push(iv[i]);i++;}while(i<n&&iv[i][0]<=ne){ns=Math.min(ns,iv[i][0]);ne=Math.max(ne,iv[i][1]);i++;}r.push([ns,ne]);while(i<n){r.push(iv[i]);i++;}return r;}
console.log("Insert brute ex1:", JSON.stringify(insertBrute([[1,3],[6,9]],[2,5])));
console.log("Insert optimal ex1:", JSON.stringify(insertOptimal([[1,3],[6,9]],[2,5])));

// LRU Cache
class LRUCacheArray { constructor(c){this.capacity=c;this.cache=[];} get(k){const i=this.cache.findIndex(([x])=>x===k);if(i===-1)return -1;const[,v]=this.cache[i];this.cache.splice(i,1);this.cache.push([k,v]);return v;} put(k,v){const i=this.cache.findIndex(([x])=>x===k);if(i!==-1)this.cache.splice(i,1);this.cache.push([k,v]);if(this.cache.length>this.capacity)this.cache.shift();} }
class DListNode { constructor(k,v){this.key=k;this.value=v;this.prev=null;this.next=null;} }
class LRUCache { constructor(c){this.capacity=c;this.map=new Map();this.head=new DListNode(null,null);this.tail=new DListNode(null,null);this.head.next=this.tail;this.tail.prev=this.head;} _remove(n){n.prev.next=n.next;n.next.prev=n.prev;} _insertAtFront(n){n.next=this.head.next;n.prev=this.head;this.head.next.prev=n;this.head.next=n;} get(k){if(!this.map.has(k))return -1;const n=this.map.get(k);this._remove(n);this._insertAtFront(n);return n.value;} put(k,v){if(this.map.has(k)){const n=this.map.get(k);n.value=v;this._remove(n);this._insertAtFront(n);return;}const n=new DListNode(k,v);this.map.set(k,n);this._insertAtFront(n);if(this.map.size>this.capacity){const l=this.tail.prev;this._remove(l);this.map.delete(l.key);}} }
function runLRU(C){const c=new C(2);const o=[];c.put(1,1);c.put(2,2);o.push(c.get(1));c.put(3,3);o.push(c.get(2));c.put(4,4);o.push(c.get(1));o.push(c.get(3));o.push(c.get(4));return o;}
console.log("LRU array:", runLRU(LRUCacheArray));
console.log("LRU optimal:", runLRU(LRUCache));
'
```

Expected output (all 6 lines):
```
Trie brute: [ true, false, true, true ]
Trie optimal: [ true, false, true, true ]
Insert brute ex1: [[1,5],[6,9]]
Insert optimal ex1: [[1,5],[6,9]]
LRU array: [ 1, -1, -1, 3, 4 ]
LRU optimal: [ 1, -1, -1, 3, 4 ]
```

- [ ] **Step 2: Full cross-page browser sweep**

For all 5 new/changed pages (`index.html`, `problem-bank/index.html`, and the 3 problem pages):
- Confirm zero console errors on load.
- Confirm the homepage's new Problem Bank card links correctly and doesn't break the existing 30-day roadmap rendering or progress bar.
- Confirm `problem-bank/index.html` correctly reflects mark-complete state changes made on each problem page (navigate: mark Trie complete on its page → back to `problem-bank/index.html` → its row shows done and the pattern's progress count updates → its overall progress bar updates).
- Confirm at mobile width (~390px) none of the 5 pages produce horizontal page-level scroll (check `document.documentElement.scrollWidth === document.documentElement.clientWidth` in devtools console on each page).
- Confirm `localStorage` after a full pass contains exactly one `problem-bank-progress` key and the pre-existing `dsa-progress`/`dsa-last-day` keys are untouched.

Fix anything found.

- [ ] **Step 3: Update `.docs/NOTES.md`**

Append an entry (matching the file's existing entry style — check the file's current last few entries for exact formatting before writing) summarizing: the Problem Bank pilot batch shipped (3 problems: Implement Trie (Prefix Tree), Insert Interval, LRU Cache), the new `problem-bank/` folder and `js/problemBank.js`/`js/problemBankProgress.js` files, that progress tracking is intentionally isolated from `DSAProgress`, and that this proves the page template (prereq banner, multi-solution animated format, complexity comparison table) ahead of the larger Backtracking batch.

- [ ] **Step 4: Commit the NOTES.md update**

```bash
git add .docs/NOTES.md
git commit -m "document Problem Bank pilot batch completion"
```

- [ ] **Step 5: Confirm active gh account, then ask the user before pushing**

```bash
gh auth status
```

Confirm the active account is `zainulhasan`. Do **not** run `git push` in this task — per this plan's Global Constraints, the final push for this batch requires explicit user confirmation. Report the commit log (`git log --oneline -10`) and ask the user to confirm before pushing.

---

## Self-Review

**1. Spec coverage against `.docs/PROBLEM-BANK-DESIGN.md`:**
- §1 (site structure/nav): Task 3 builds the pattern-grouped landing page; Task 4 links it from the homepage; every problem page has a "← Problem Bank" nav link (Tasks 5-7) — covered.
- §2 (file structure): flat `problem-bank/<slug>.html` files, `js/problemBank.js`, `js/problemBankProgress.js` — exactly as specified — covered (Tasks 1, 2, 5-7).
- §3 (page template, all 6 numbered items): prereq banner (item 1) in every problem page; problem statement in our own words (item 2); solutions brute-force-to-optimal with framing/diagram/animation/code/complexity each (item 3) — covered for all 3 problems, 2 solutions each; complexity comparison table (item 4); 5-question reasoning-focused quiz (item 5); mark-complete via `ProblemBankProgress` (item 6) — all covered in Tasks 5-7.
- §4 (progress tracking): `totalCount()` computed from `PROBLEM_BANK.length` at call time, not hardcoded; separate `localStorage` key — covered in Task 1, explicitly re-verified in Task 8 Step 2.
- §5 (build plan): pilot batch is exactly Trie/Intervals/Design, 1 problem each, following the same builder→reviewer→re-verify→browser-test→fix→commit pipeline (adapted to this plan's task structure) — covered.
- §6 (deferred items): prereq-day mapping assigned per-problem in Task 2's data (Day 19/29/15) — resolved for this batch as the spec anticipated; final total problem count and SEO pass remain explicitly out of scope here, matching the spec.

**2. Placeholder scan:** No "TBD"/"TODO"/"add error handling" phrasing anywhere above. Every code block is complete, runnable, and (for the 6 core algorithms) independently node-verified with a transcript included in the task that uses it. Diagram SVGs, quiz questions, and animation step-generators are fully written out, not described abstractly.

**3. Type/naming consistency check across tasks:**
- `ProblemBankProgress.isDone/setDone/toggle/completedCount/totalCount` (defined Task 1) — used with these exact names in Tasks 3, 5, 6, 7. Consistent.
- `PROBLEM_BANK` / `PROBLEM_BANK_PATTERNS` / `problemBankInfo` (defined Task 2) — `PROBLEM_BANK`/`PROBLEM_BANK_PATTERNS` consumed in Task 3's `renderPatternGroups`. `problemBankInfo` is defined but not actually called anywhere in Tasks 3/5/6/7 (each problem page hardcodes its own title/prereq text directly in the HTML rather than reading it from `PROBLEM_BANK` at runtime, matching how `lessons/dayNN.html` pages hardcode their own day number/title rather than reading `dsaDayInfo()` for their own `<h1>`). This is intentional, not a bug: `dsaDayInfo()`/`problemBankInfo()` exist for OTHER pages to look up a page's metadata (the roadmap/landing page), not for a page to look up itself. No fix needed.
- Every problem page defines its own local `SLUG` constant matching its `PROBLEM_BANK` entry's `slug` field exactly (`implement-trie-prefix-tree`, `insert-interval`, `lru-cache`) — verified matching in Tasks 2, 5, 6, 7.
- `.prereq-banner` CSS is added once in Task 5 Step 3, with an explicit note in Tasks 6/7 that it's shared (no duplicate CSS rule risk) — Tasks 6 and 7 don't re-add it.
