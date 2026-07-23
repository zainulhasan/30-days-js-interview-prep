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
