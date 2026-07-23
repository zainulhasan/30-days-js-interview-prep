/*
 * DSA course — progress tracking, stored in localStorage.
 * Key: "dsa-progress" -> { "1": <ms timestamp>, "2": <ms timestamp>, ... } (day number -> done-at time)
 * Entries from before this timestamp change was added may still hold the literal
 * boolean `true` instead of a timestamp — still truthy, so isDone()/completedCount()
 * are unaffected, but completionTimestamps() skips those (no real date to report).
 */
const DSAProgress = (function () {
  'use strict';
  const KEY = 'dsa-progress';
  const LAST_KEY = 'dsa-last-day';
  const TOTAL_DAYS = 30;

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

  function isDone(day) {
    return !!load()[day];
  }

  function setDone(day, done) {
    const data = load();
    if (done) data[day] = Date.now();
    else delete data[day];
    save(data);
  }

  function completionTimestamps() {
    const data = load();
    return Object.values(data).filter((v) => typeof v === 'number');
  }

  function toggle(day) {
    const done = !isDone(day);
    setDone(day, done);
    return done;
  }

  function completedCount() {
    const data = load();
    return Object.keys(data).filter((k) => data[k]).length;
  }

  function setLastDay(day) {
    localStorage.setItem(LAST_KEY, String(day));
  }

  function getLastDay() {
    const v = localStorage.getItem(LAST_KEY);
    return v ? Number(v) : null;
  }

  function firstIncompleteDay() {
    const data = load();
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      if (!data[d]) return d;
    }
    return TOTAL_DAYS;
  }

  return {
    TOTAL_DAYS,
    isDone,
    setDone,
    toggle,
    completedCount,
    completionTimestamps,
    setLastDay,
    getLastDay,
    firstIncompleteDay,
  };
})();
