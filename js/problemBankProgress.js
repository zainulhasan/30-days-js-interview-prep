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
