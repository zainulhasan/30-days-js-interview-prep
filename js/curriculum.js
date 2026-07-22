/* DSA course — the 30-day roadmap, shared by index.html and every lesson page. */
const DSA_DAYS = [
  { day: 1, week: 1, title: 'JS Essentials for DSA', blurb: 'Arrays, objects, loops, functions, destructuring, and spread — the JS toolkit every DSA solution uses.' },
  { day: 2, week: 1, title: 'Big-O Notation', blurb: 'Visualize how O(1), O(log n), O(n), O(n log n), and O(n²) actually grow.' },
  { day: 3, week: 1, title: 'Arrays & Strings', blurb: 'Core array/string operations and the mistakes that trip people up in interviews.' },
  { day: 4, week: 1, title: 'Two-Pointer Pattern', blurb: 'Two pointers moving toward each other or together to solve problems in one pass.' },
  { day: 5, week: 1, title: 'Sliding Window Pattern', blurb: 'Slide a window across an array or string to track a running range efficiently.' },
  { day: 6, week: 1, title: 'Hash Maps & Sets', blurb: 'Frequency counting with hash maps and sets — the pattern behind half of all interview questions.' },
  { day: 7, week: 1, title: 'Week 1 Review', blurb: 'Review day — 5 mixed practice problems plus a Week 1 cheat sheet.' },
  { day: 8, week: 2, title: 'Bubble / Selection / Insertion Sort', blurb: 'Three classic sorts, animated bar-by-bar so you can see every compare and swap.' },
  { day: 9, week: 2, title: 'Recursion & the Call Stack', blurb: 'Watch the call stack grow and shrink as recursive calls run.' },
  { day: 10, week: 2, title: 'Merge Sort', blurb: 'Split, sort, and merge — animated divide and conquer.' },
  { day: 11, week: 2, title: 'Quick Sort', blurb: 'Partition around a pivot and watch it land in its final sorted spot.' },
  { day: 12, week: 2, title: 'Binary Search', blurb: 'The classic binary search template — and the off-by-one traps that break it.' },
  { day: 13, week: 2, title: 'Binary Search Variations', blurb: 'First/last occurrence, search on answer, and other binary search variants.' },
  { day: 14, week: 2, title: 'Week 2 Review', blurb: 'Review day — mixed practice problems plus a Week 2 cheat sheet.' },
  { day: 15, week: 3, title: 'Linked Lists', blurb: 'Build a linked list from scratch and watch the node pointers move.' },
  { day: 16, week: 3, title: 'Linked Lists II — Fast/Slow & Reverse', blurb: 'Fast/slow pointers and reversing a list, one animated pointer swap at a time.' },
  { day: 17, week: 3, title: 'Stacks', blurb: 'Push/pop mechanics through valid parentheses and a min-stack.' },
  { day: 18, week: 3, title: 'Queues & Deques', blurb: 'Enqueue/dequeue mechanics, plus the sliding window maximum problem.' },
  { day: 19, week: 3, title: 'Trees — BFS & DFS', blurb: 'Build a binary tree and animate BFS vs. DFS traversal order.' },
  { day: 20, week: 3, title: 'Binary Search Trees', blurb: 'Insert, search, and validate a binary search tree — animated.' },
  { day: 21, week: 3, title: 'Week 3 Review', blurb: 'Review day — mixed practice problems plus a Week 3 cheat sheet.' },
  { day: 22, week: 4, title: 'Heaps & Priority Queues', blurb: 'Bubble-up and bubble-down animated inside a binary heap.' },
  { day: 23, week: 4, title: 'Graphs — BFS & DFS', blurb: 'Graph representations, plus BFS and DFS animated on a node graph.' },
  { day: 24, week: 4, title: 'Graphs II — Shortest Path & Topo Sort', blurb: 'Shortest-path ideas and topological sort on a graph.' },
  { day: 25, week: 4, title: 'Dynamic Programming I', blurb: 'Memoization and DP tables — fibonacci and climbing stairs, filled cell by cell.' },
  { day: 26, week: 4, title: 'Dynamic Programming II', blurb: 'Coin change and house robber — classic DP problems with animated tables.' },
  { day: 27, week: 4, title: 'Greedy Algorithms', blurb: 'Greedy algorithms, and a counter-example showing exactly when greedy fails.' },
  { day: 28, week: 4, title: 'Pattern Recognition Masterclass', blurb: '"Which pattern do I use?" — a decision flowchart covering everything so far.' },
  { day: 29, week: 4, title: 'Mock Interview Day', blurb: '4 timed mock-interview problems with a countdown timer, then full solutions.' },
  { day: 30, week: 4, title: 'Final Review & Cheat Sheet', blurb: 'The complete cheat sheet — every pattern and complexity, plus an interview-day checklist.' },
];

const DSA_WEEKS = [
  { week: 1, title: 'JavaScript foundations + core patterns' },
  { week: 2, title: 'Sorting, searching, recursion' },
  { week: 3, title: 'Core data structures' },
  { week: 4, title: 'Advanced topics + interview simulation' },
];

function dsaDayInfo(day) {
  return DSA_DAYS.find((d) => d.day === day) || null;
}
