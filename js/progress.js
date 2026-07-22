/*
 * DSA course — progress tracking, stored in localStorage.
 * Key: "dsa-progress" -> { "1": true, "2": true, ... } (day number -> done)
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
    if (done) data[day] = true;
    else delete data[day];
    save(data);
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
    setLastDay,
    getLastDay,
    firstIncompleteDay,
  };
})();
