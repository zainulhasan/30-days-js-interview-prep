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
  {
    slug: 'combination-sum',
    title: 'Combination Sum',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    prereqDay: 9,
    prereqTitle: 'Recursion & the Call Stack',
    leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
  },
  {
    slug: 'subsets',
    title: 'Subsets',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    prereqDay: 9,
    prereqTitle: 'Recursion & the Call Stack',
    leetcodeUrl: 'https://leetcode.com/problems/subsets/',
  },
  {
    slug: 'permutations',
    title: 'Permutations',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    prereqDay: 9,
    prereqTitle: 'Recursion & the Call Stack',
    leetcodeUrl: 'https://leetcode.com/problems/permutations/',
  },
  {
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    prereqDay: 9,
    prereqTitle: 'Recursion & the Call Stack',
    leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/',
  },
  {
    slug: 'letter-combinations-of-a-phone-number',
    title: 'Letter Combinations of a Phone Number',
    pattern: 'Backtracking',
    difficulty: 'Medium',
    prereqDay: 9,
    prereqTitle: 'Recursion & the Call Stack',
    leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
  },
  {
    slug: 'n-queens',
    title: 'N-Queens',
    pattern: 'Backtracking',
    difficulty: 'Hard',
    prereqDay: 9,
    prereqTitle: 'Recursion & the Call Stack',
    leetcodeUrl: 'https://leetcode.com/problems/n-queens/',
  },
];

const PROBLEM_BANK_PATTERNS = [
  { key: 'Trie', title: 'Trie' },
  { key: 'Intervals', title: 'Intervals' },
  { key: 'Design', title: 'Design' },
  { key: 'Backtracking', title: 'Backtracking' },
];

function problemBankInfo(slug) {
  return PROBLEM_BANK.find((p) => p.slug === slug) || null;
}
