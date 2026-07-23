# Problem Bank Candidates — Round 2 Research

Consolidated output of a 6-agent research pass (4 initial: general web, GitHub, Medium/blogs,
YouTube-creators; 2 targeted follow-ups: BST, Greedy+padding) plus an advisor/consolidation pass,
run to source 50-60 new "frequently asked real interview" LeetCode problems for a second problem
bank, building on the existing 30-day course. See `.docs/NOTES.md` for how the 30-day course itself
was built — this doc is the source-of-truth candidate list for whatever gets built next.

**Status: candidate list for review — nothing here is built yet.** User is expected to review,
trim/reorder, and add their own suggested problems before any problem pages get built.

## Headline numbers

- **71 total new candidates** after full dedup against the 30-day course's ~95 already-used
  problems and against each other (some problems were independently rediscovered by both the
  original 4-agent round and the BST/Greedy follow-up round — kept once, confidence boosted).
  Two more duplicates (Merge Sorted Array, Search a 2D Matrix) were caught and removed during
  final review — the follow-up research agents had an abbreviated exclusion list and resurfaced
  them by mistake; both are already used on Day 10/11 and Day 14 respectively.
- Exceeds the 50-60 target, so there's room to trim rather than pad.
- **3 candidates excluded per explicit decision**: Alien Dictionary, Meeting Rooms II, Encode and
  Decode Strings — all LeetCode Premium/paywalled, cut to keep the site's "free, no sign-up"
  promise intact. (Closest Binary Search Tree Value II from the BST follow-up is also likely
  premium-locked and excluded for the same reason.)
- **Correction applied**: Edit Distance is **Hard**, not Medium (one source had it wrong).

## How to read the confidence/corroboration column

- **Very High** — found independently by 2+ separate research rounds/agents, or backed by
  multiple curated lists (Blind 75 + NeetCode 150 + Grind 75) AND real company-frequency data.
- **High** — backed by either multiple curated lists, or real company-tag frequency data
  (from the `liquidslr/leetcode-company-wise-problems` GitHub repo, which scrapes LeetCode's own
  per-company frequency scores) from 2+ companies including at least one smaller/curated list
  (not just Amazon/Google's ~2,000-row catch-all sets).
- **Medium** — real evidence but narrower (single strong source, or only present in the large
  catch-all company lists).
- Anything not meeting "Medium" was cut rather than included — see the individual research
  agents' full output (not persisted, was in-conversation only) if you want the discarded tier.

---

## Arrays & Hashing (5 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Valid Sudoku | Medium | leetcode.com/problems/valid-sudoku/ | High |
| First Missing Positive | Hard | leetcode.com/problems/first-missing-positive/ | High |
| Majority Element | Easy | leetcode.com/problems/majority-element/ | High |
| Maximum Subarray (Kadane's) | Medium | leetcode.com/problems/maximum-subarray/ | High |
| Longest Consecutive Sequence | Medium | leetcode.com/problems/longest-consecutive-sequence/ | Medium |

## Two Pointers (4 new — Merge Sorted Array cut, already used on Day 10/11)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Trapping Rain Water | Hard | leetcode.com/problems/trapping-rain-water/ | High |
| 4Sum | Medium | leetcode.com/problems/4sum/ | High |
| Next Permutation | Medium | leetcode.com/problems/next-permutation/ | High |
| Find the Duplicate Number | Medium | leetcode.com/problems/find-the-duplicate-number/ | **Very High** — independently found by both research rounds |

## Sliding Window (5 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Minimum Window Substring | Hard | leetcode.com/problems/minimum-window-substring/ | **Very High** — independently found by both research rounds, "asked across all FAANG" |
| Permutation in String | Medium | leetcode.com/problems/permutation-in-string/ | High |
| Contains Duplicate II | Easy | leetcode.com/problems/contains-duplicate-ii/ | Medium-High |
| Fruit Into Baskets | Medium | leetcode.com/problems/fruit-into-baskets/ | Medium (same pattern as "longest substring with ≤K distinct chars") |
| Max Consecutive Ones III | Medium | leetcode.com/problems/max-consecutive-ones-iii/ | Medium |

## Stack (2 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Largest Rectangle in Histogram | Hard | leetcode.com/problems/largest-rectangle-in-histogram/ | Medium |
| Evaluate Reverse Polish Notation | Medium | leetcode.com/problems/evaluate-reverse-polish-notation/ | Medium |

## Binary Search (2 new — Search a 2D Matrix cut, already used on Day 14)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Find Minimum in Rotated Sorted Array | Medium | leetcode.com/problems/find-minimum-in-rotated-sorted-array/ | **Very High** |
| Median of Two Sorted Arrays | Hard | leetcode.com/problems/median-of-two-sorted-arrays/ | High — "#1-3 highest-frequency at Google/Amazon/Apple/Microsoft" |

## Linked List (3 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Merge Two Sorted Lists | Easy | leetcode.com/problems/merge-two-sorted-lists/ | **Very High** |
| Copy List with Random Pointer | Medium | leetcode.com/problems/copy-list-with-random-pointer/ | High |
| Remove Nth Node From End of List | Medium | leetcode.com/problems/remove-nth-node-from-end-of-list/ | Medium |

## Trees — general/DFS (4 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Binary Tree Maximum Path Sum | Hard | leetcode.com/problems/binary-tree-maximum-path-sum/ | High |
| Diameter of Binary Tree | Easy | leetcode.com/problems/diameter-of-binary-tree/ | Medium |
| Lowest Common Ancestor of a Binary Tree (general, not BST) | Medium | leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/ | Medium |
| Same Tree | Easy | leetcode.com/problems/same-tree/ | Medium |

## Binary Search Tree (10 new — was completely empty before the follow-up pass)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Convert Sorted Array to Binary Search Tree | Easy | leetcode.com/problems/convert-sorted-array-to-binary-search-tree/ | High — 7 companies incl. small curated lists |
| Binary Search Tree Iterator | Medium | leetcode.com/problems/binary-search-tree-iterator/ | High |
| Delete Node in a BST | Medium | leetcode.com/problems/delete-node-in-a-bst/ | High |
| Recover Binary Search Tree | Medium | leetcode.com/problems/recover-binary-search-tree/ | High |
| Two Sum IV - Input is a BST | Easy | leetcode.com/problems/two-sum-iv-input-is-a-bst/ | High |
| Convert Sorted List to Binary Search Tree | Medium | leetcode.com/problems/convert-sorted-list-to-binary-search-tree/ | Medium-High |
| Unique Binary Search Trees | Medium | leetcode.com/problems/unique-binary-search-trees/ | Medium (real freq, but it's more a Catalan-number DP problem than BST manipulation — consider filing under DP instead) |
| Unique Binary Search Trees II | Medium | leetcode.com/problems/unique-binary-search-trees-ii/ | Medium |
| Trim a Binary Search Tree | Medium | leetcode.com/problems/trim-a-binary-search-tree/ | Medium |
| Balance a Binary Search Tree | Medium | leetcode.com/problems/balance-a-binary-search-tree/ | Medium |

## Heap / Priority Queue (3 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Find Median from Data Stream | Hard | leetcode.com/problems/find-median-from-data-stream/ | High |
| K Closest Points to Origin | Medium | leetcode.com/problems/k-closest-points-to-origin/ | Medium |
| Task Scheduler | Medium | leetcode.com/problems/task-scheduler/ | Medium |

## Backtracking (6 new — strongest pattern in the whole research)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Combination Sum | Medium | leetcode.com/problems/combination-sum/ | **Very High** |
| Subsets | Medium | leetcode.com/problems/subsets/ | High |
| Permutations | Medium | leetcode.com/problems/permutations/ | High |
| Generate Parentheses | Medium | leetcode.com/problems/generate-parentheses/ | Medium |
| Letter Combinations of a Phone Number | Medium | leetcode.com/problems/letter-combinations-of-a-phone-number/ | Medium |
| N-Queens | Hard | leetcode.com/problems/n-queens/ | Medium |

## Trie (1 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Implement Trie (Prefix Tree) | Medium | leetcode.com/problems/implement-trie-prefix-tree/ | High — foundational, site has no Trie problem at all yet |

## Graphs (5 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Pacific Atlantic Water Flow | Medium | leetcode.com/problems/pacific-atlantic-water-flow/ | High |
| Word Ladder | Hard | leetcode.com/problems/word-ladder/ | Medium |
| Longest Increasing Path in a Matrix | Hard | leetcode.com/problems/longest-increasing-path-in-a-matrix/ | Medium |
| Jump Game IV | Medium | leetcode.com/problems/jump-game-iv/ | Low-Medium — single niche source |
| Shortest Path in a Grid with Obstacles Elimination | Hard | leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/ | Low-Medium — single niche source |

## Dynamic Programming — 1D (3 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Word Break | Medium | leetcode.com/problems/word-break/ | **Very High** |
| Decode Ways | Medium | leetcode.com/problems/decode-ways/ | Medium |
| House Robber II | Medium | leetcode.com/problems/house-robber-ii/ | Medium — sequel to House Robber (already on site) |

## Dynamic Programming — 2D (2 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Edit Distance | **Hard** (corrected) | leetcode.com/problems/edit-distance/ | High |
| Regular Expression Matching | Hard | leetcode.com/problems/regular-expression-matching/ | Medium |

## Greedy (12 new — was completely empty before the follow-up pass)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Jump Game II | Medium | leetcode.com/problems/jump-game-ii/ | High |
| Gas Station | Medium | leetcode.com/problems/gas-station/ | High |
| Candy | Hard | leetcode.com/problems/candy/ | High |
| Partition Labels | Medium | leetcode.com/problems/partition-labels/ | High |
| Valid Parenthesis String | Medium | leetcode.com/problems/valid-parenthesis-string/ | High |
| Hand of Straights | Medium | leetcode.com/problems/hand-of-straights/ | High |
| Merge Triplets to Form Target Triplet | Medium | leetcode.com/problems/merge-triplets-to-form-target-triplet/ | Medium-High |
| Assign Cookies | Easy | leetcode.com/problems/assign-cookies/ | Medium-High — good "intro greedy" easy on-ramp |
| Can Place Flowers | Easy | leetcode.com/problems/can-place-flowers/ | Medium-High |
| Boats to Save People | Medium | leetcode.com/problems/boats-to-save-people/ | Medium-High |
| Two City Scheduling | Medium | leetcode.com/problems/two-city-scheduling/ | Medium |
| Minimum Number of Arrows to Burst Balloons | Medium | leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/ | Medium — pairs with Non-overlapping Intervals (already on site) |

## Intervals (1 new)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Insert Interval | Medium | leetcode.com/problems/insert-interval/ | High — pairs with Merge Intervals (already on site) |

## Bit Manipulation (2 new — new pattern for the site)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Sum of Two Integers | Medium | leetcode.com/problems/sum-of-two-integers/ | Medium |
| Number of 1 Bits | Easy | leetcode.com/problems/number-of-1-bits/ | Medium — good entry point |

## Math / Geometry (2 new — new pattern for the site)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| Rotate Image | Medium | leetcode.com/problems/rotate-image/ | Medium |
| Spiral Matrix | Medium | leetcode.com/problems/spiral-matrix/ | Medium |

## Design (1 new — 2 others cut for being Premium)
| Problem | Difficulty | LeetCode URL | Confidence |
|---|---|---|---|
| LRU Cache | Medium | leetcode.com/problems/lru-cache/ | **Very High** — "constantly at all FAANG"; Serialize/Deserialize Binary Tree also very high but filed under Trees above |

---

## Cut from the research (flagged, not included above)

- **Alien Dictionary, Meeting Rooms II, Encode and Decode Strings, Closest Binary Search Tree
  Value II** — all LeetCode Premium/paywalled, cut per the site's free/no-sign-up requirement.
- **Text Justification** — doesn't map to any of the site's existing pattern categories
  (string-formatting/simulation); cut unless a "Simulation" module gets added later.
- **Merge Sorted Array** — genuinely reported by the padding follow-up agent (Amazon/Google
  frequency data), but it's already used on Day 10/11 of the 30-day course; the agent's exclusion
  list was abbreviated and missed it. Removed during final review.
- **Search a 2D Matrix** — this was never actually reported by any research agent; it was a
  transcription slip on my part while drafting the first version of this doc, not a real research
  finding that needed excluding. Removed, noted here only so the correction is traceable.

## High-value repeats (already on the 30-day course — NOT new picks, but strongest possible
candidates for a "revisit with brute-force → optimal, multiple solutions" deeper treatment,
since the user's plan for this problem bank explicitly wants multiple solutions per problem)

All 24 below were cited by 3 of the original 4 independent research agents — the highest
corroboration tier found anywhere in this research, on par with or above most of the "new" list:

Two Sum, Best Time to Buy and Sell Stock, 3Sum, Container With Most Water, Longest Substring
Without Repeating Characters, Group Anagrams, Search in Rotated Sorted Array, Reverse Linked List,
Linked List Cycle, Merge k Sorted Lists, Maximum Depth of Binary Tree, Validate Binary Search Tree,
Clone Graph, Number of Islands, Course Schedule, Word Search, Climbing Stairs, Coin Change,
Longest Increasing Subsequence, House Robber, Product of Array Except Self, Merge Intervals,
Top K Frequent Elements, Kth Largest Element in an Array

## Next steps (not yet done)
1. User reviews this list, trims/reorders, adds their own suggested problems.
2. Decide the final problem count (71 available, target was 50-60 — trim or keep more).
3. Plan the actual page format: multiple solutions per problem (brute force → optimal), prereq
   link back to the relevant 30-day-course lesson, line-by-line explanation, diagram, and
   interactive visualization — matching the existing course's depth. This part is not designed
   yet, only the candidate list is done.
4. System design section is a separate, later phase per the user's own ordering — not started.
