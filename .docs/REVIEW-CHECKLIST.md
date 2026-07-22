# Lesson Review Checklist

Standard checklist for the content-advisor review pass every lesson (`lessons/dayXX.html`) goes
through after it's built and self-verified in-browser, before moving to the next day. Distilled
from the Day 1 and Day 2 review rounds (both found real, must-fix bugs — this step is not
optional or ceremonial).

Use this file to keep each review-agent dispatch short: point the agent at this checklist plus
the target lesson file, instead of re-writing the full criteria in every prompt.

## Required sections (verify ALL present)
1. Goal of the day — 2-3 bullets
2. Concept — plain-English explanation with a real-life analogy
3. Diagram(s) — inline SVG (multiple are fine/expected if one concept doesn't cover everything)
4. Interactive visualization(s) — Play/Step/Reset/Shuffle, plain-English narration per step
   (multiple are fine when one animation can't cover everything cleanly — see Day 1)
5. The code — commented, with a line-by-line explanation list after it
6. A step-by-step dry run — table tracing variables for one concrete example
7. Complexity — time AND space, with a one-line "why" per row
8. Interview corner — 3-5 real questions, at least one explicit "↳ Common follow-up:" chain,
   at least one explicit "⚠ Trap:" callout, plus a "how to talk through it out loud" paragraph
9. Practice problems — exactly 3, easy → medium, each with: problem statement, a hint that
   points at the right tool without stating the algorithm, a full correct solution, and a REAL
   `<a href>` link to the actual LeetCode problem (not plain text)
10. Quiz — 5 multiple-choice questions, instant feedback, exactly one defensible correct answer
    each, explanation actually justifies the answer
11. Prev/Next nav + mark-complete button

## Checks to run every time
- **Factual/mathematical accuracy** — recompute any numbers (Big-O values, dry-run traces,
  array indices) independently rather than trusting the prose. Verify JS language claims
  against actual JS semantics.
- **Cross-section consistency** — do the diagram(s), animation narration, code sample, dry-run
  table, and complexity table all use the SAME example values and reach the SAME conclusions?
  This exact bug class has been found twice already (Day 1: animation's push value didn't match
  the code/diagram; Day 2: a quiz explanation invented a false claim). Check hard.
- **LeetCode links and difficulty labels** — verify against the real LeetCode listing, don't
  assume. Two real bugs found so far: a mislabeled difficulty, and problems referenced by name
  only instead of as real links.
- **Quiz quality** — for any comparison-based question ("which is faster/bigger/grows more"),
  check there's no edge case in the range actually shown/discussed where the claim breaks.
- **Beginner-friendliness** — would a junior dev understand this, not just a technically-correct
  reader? Flag anything that's accurate but sets up a misconception (e.g. "spread is free").
- **Interview-wrongness** — anything a candidate would lose points for repeating verbatim.
- **Mobile/rendering risk** — any table with many columns or number-heavy cells (can't word-wrap)
  needs an `overflow-x:auto` wrapper div. Any SVG text line needs to be short enough not to get
  clipped at the diagram's viewBox edge (SVG text does not wrap).

## Report format
Prioritized list: **"must fix before moving to the next day"** vs. **"nice to have."** For
sections with no issues, say so briefly rather than skipping silently. Read-only — the review
agent does not edit files; the main session applies fixes and re-verifies afterward.

## Standard review-agent dispatch prompt (copy/adapt per lesson)

```
Review lessons/dayXX.html (Day XX: <topic>) as a skeptical content advisor, against the
checklist in .docs/REVIEW-CHECKLIST.md. Also skim js/engine.js and css/style.css for shared-
component context, and lessons/day01.html as the reference template if useful for comparison.
Note any lesson-specific approved deviations from the standard engine (check .docs/DECISIONS.md)
before flagging them as issues. Report must-fix vs nice-to-have per the checklist's report
format. Read-only — do not edit files.
```
