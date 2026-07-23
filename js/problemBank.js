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

// Other problems sharing the same pattern, in PROBLEM_BANK order, wrapping
// around after the given slug so every problem in a pattern gets a varied set
// of neighbors instead of always seeing the same fixed "next 3".
function relatedProblems(slug, limit) {
  const current = problemBankInfo(slug);
  if (!current) return [];
  const samePattern = PROBLEM_BANK.filter((p) => p.pattern === current.pattern && p.slug !== slug);
  const startIndex = PROBLEM_BANK.findIndex((p) => p.slug === slug);
  samePattern.sort((a, b) => {
    const distA = (PROBLEM_BANK.indexOf(a) - startIndex + PROBLEM_BANK.length) % PROBLEM_BANK.length;
    const distB = (PROBLEM_BANK.indexOf(b) - startIndex + PROBLEM_BANK.length) % PROBLEM_BANK.length;
    return distA - distB;
  });
  return samePattern.slice(0, limit);
}
