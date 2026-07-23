/*
 * Cross-course streak tracker — combines completion timestamps from both
 * DSAProgress (30-day course) and ProblemBankProgress (Problem Bank) to compute
 * a single "days active" streak. Read-only: does not write to either progress
 * store, only reads via their completionTimestamps() methods, so both of those
 * scripts must be included on the page before this one.
 */
const DSAStreak = (function () {
  'use strict';

  function dayKey(ms) {
    const d = new Date(ms);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function activeDayKeys() {
    const timestamps = []
      .concat(typeof DSAProgress !== 'undefined' ? DSAProgress.completionTimestamps() : [])
      .concat(typeof ProblemBankProgress !== 'undefined' ? ProblemBankProgress.completionTimestamps() : []);
    return new Set(timestamps.map(dayKey));
  }

  // Returns { current, longest }. current = consecutive active days ending today
  // or yesterday (a day with no activity YET doesn't break the streak until the
  // day is fully over). longest = best consecutive run ever recorded.
  function compute() {
    const keys = activeDayKeys();
    if (keys.size === 0) return { current: 0, longest: 0 };

    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let current = 0;
    let cursor = today.getTime();
    if (!keys.has(dayKey(cursor))) cursor -= oneDay;
    while (keys.has(dayKey(cursor))) {
      current++;
      cursor -= oneDay;
    }

    const sortedMs = Array.from(keys)
      .map((k) => {
        const [y, m, d] = k.split('-').map(Number);
        return new Date(y, m - 1, d).getTime();
      })
      .sort((a, b) => a - b);
    let longest = 1;
    let run = 1;
    for (let i = 1; i < sortedMs.length; i++) {
      run = sortedMs[i] - sortedMs[i - 1] === oneDay ? run + 1 : 1;
      longest = Math.max(longest, run);
    }
    longest = Math.max(longest, current);

    return { current, longest };
  }

  return { compute };
})();
