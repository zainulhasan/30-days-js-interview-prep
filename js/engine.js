/*
 * DSA course — shared visualizer engine.
 * One StepPlayer (Play/Step/Reset/Shuffle + narration) drives four render
 * modes: Bars, Graph (nodes+arrows), Grid (2D table), CallStack.
 * Lesson code builds an array of "steps" describing what happens, in plain
 * English, and hands it to a player. No dependencies, no build step.
 */
const DSA = (function () {
  'use strict';

  // ---- shared color legend --------------------------------------------
  // yellow=comparing, red=swap/remove, green=sorted/found, blue=pointer/pivot
  const STATE_CLASS = {
    default: 'dsa-cell',
    compare: 'dsa-cell dsa-compare',
    swap: 'dsa-cell dsa-swap',
    sorted: 'dsa-cell dsa-sorted',
    pointer: 'dsa-cell dsa-pointer',
    active: 'dsa-cell dsa-active',
  };

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function randomArray(n, min, max) {
    const a = [];
    for (let i = 0; i < n; i++) a.push(min + Math.floor(Math.random() * (max - min + 1)));
    return a;
  }

  // ---- StepPlayer --------------------------------------------------------
  // steps: [{ narration: string, ...anything the render callback needs }]
  class StepPlayer {
    constructor({ steps = [], onStep, narrationEl, playBtn, stepBtn, resetBtn, shuffleBtn, onShuffle, speed = 700, counterEl }) {
      this.steps = steps;
      this.onStep = onStep;
      this.narrationEl = narrationEl;
      this.counterEl = counterEl;
      this.index = -1;
      this.playing = false;
      this.speed = speed;
      this.timer = null;
      this.playBtn = playBtn;

      if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());
      if (stepBtn) stepBtn.addEventListener('click', () => this.step());
      if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
          this.pause();
          if (onShuffle) onShuffle();
        });
      }
      this.render();
    }

    setSteps(steps) {
      this.steps = steps;
      this.reset();
    }

    reset() {
      this.pause();
      this.index = -1;
      this.render();
    }

    step() {
      if (this.index >= this.steps.length - 1) {
        this.pause();
        return;
      }
      this.index++;
      this.render();
      if (this.index >= this.steps.length - 1) this.pause();
    }

    render() {
      const step = this.index >= 0 ? this.steps[this.index] : null;
      if (this.narrationEl) {
        this.narrationEl.textContent = step
          ? step.narration
          : 'Press Play or Step to begin.';
      }
      if (this.counterEl) {
        const total = this.steps.length;
        this.counterEl.textContent = total ? `Step ${Math.max(this.index + 1, 0)} / ${total}` : '';
      }
      if (this.onStep) this.onStep(step, this.index);
    }

    togglePlay() {
      if (this.playing) this.pause();
      else this.play();
    }

    play() {
      if (this.index >= this.steps.length - 1) this.index = -1;
      this.playing = true;
      if (this.playBtn) this.playBtn.textContent = '⏸ Pause';
      this.timer = setInterval(() => this.step(), this.speed);
    }

    pause() {
      this.playing = false;
      if (this.playBtn) this.playBtn.textContent = '▶ Play';
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
    }
  }

  // ---- Bars renderer -------------------------------------------------
  // For arrays: sorting, two-pointer, sliding window, binary search.
  class Bars {
    // uniform: true renders every bar at the same height, and treats values as
    // opaque labels (e.g. characters) instead of numbers used for height math.
    constructor(container, { min = 0, max = 100, uniform = false } = {}) {
      this.container = container;
      this.min = min;
      this.max = max;
      this.uniform = uniform;
      this.container.classList.add('dsa-bars');
    }

    setData(data) {
      this.data = data.slice();
      this.container.innerHTML = '';
      this.bars = this.data.map((value) => {
        const bar = document.createElement('div');
        bar.className = 'dsa-cell dsa-bar';
        const label = document.createElement('span');
        label.className = 'dsa-bar-label';
        label.textContent = value;
        bar.appendChild(label);
        this.container.appendChild(bar);
        return bar;
      });
      this.paint();
    }

    // states: { index: 'compare' | 'swap' | 'sorted' | 'pointer' | 'active' }
    paint(states = {}, values = null) {
      const data = values || this.data;
      const range = Math.max(1, this.max - this.min);
      this.bars.forEach((bar, i) => {
        const v = data[i];
        if (this.uniform) {
          bar.style.height = '60%';
        } else {
          const pct = 10 + (90 * (v - this.min)) / range;
          bar.style.height = pct + '%';
        }
        bar.querySelector('.dsa-bar-label').textContent = v;
        bar.className = STATE_CLASS[states[i] || 'default'] + ' dsa-bar';
      });
      if (values) this.data = values.slice();
    }
  }

  // ---- Graph renderer --------------------------------------------------
  // For linked lists, trees, BSTs, heaps, generic graphs.
  // nodes: [{ id, x, y, label }]  edges: [{ from, to, directed }]
  class Graph {
    constructor(container, { width = 600, height = 300 } = {}) {
      this.container = container;
      this.container.classList.add('dsa-graph-wrap');
      this.width = width;
      this.height = height;
      const ns = 'http://www.w3.org/2000/svg';
      this.svg = document.createElementNS(ns, 'svg');
      this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      this.svg.classList.add('dsa-graph-svg');
      // Never let the SVG shrink below its own natural width — node/text size is defined in
      // viewBox user units, so squeezing it into a narrow mobile container would scale every
      // label down proportionally, past legibility. Scroll horizontally instead (same pattern
      // as the site's wide tables/code blocks), which keeps text at its intended physical size.
      this.svg.style.minWidth = width + 'px';
      this.svg.setAttribute('role', 'img');
      const marker = document.createElementNS(ns, 'defs');
      marker.innerHTML =
        '<marker id="dsa-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" class="dsa-arrowhead"></path></marker>';
      this.svg.appendChild(marker);
      this.container.innerHTML = '';
      this.container.appendChild(this.svg);
    }

    setGraph(nodes, edges) {
      this.nodes = nodes;
      this.edges = edges;
      this.render();
    }

    render(states = {}, edgeStates = {}) {
      const ns = 'http://www.w3.org/2000/svg';
      while (this.svg.children.length > 1) this.svg.removeChild(this.svg.lastChild);
      const byId = Object.fromEntries(this.nodes.map((n) => [n.id, n]));

      this.edges.forEach((e, i) => {
        const a = byId[e.from];
        const b = byId[e.to];
        if (!a || !b) return;
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', a.x);
        line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x);
        line.setAttribute('y2', b.y);
        line.setAttribute('class', 'dsa-edge ' + (edgeStates[i] ? 'dsa-edge-' + edgeStates[i] : ''));
        if (e.directed) line.setAttribute('marker-end', 'url(#dsa-arrow)');
        this.svg.appendChild(line);
      });

      this.nodes.forEach((n) => {
        const g = document.createElementNS(ns, 'g');
        const state = states[n.id] || 'default';
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', n.x);
        circle.setAttribute('cy', n.y);
        circle.setAttribute('r', 18);
        circle.setAttribute('class', STATE_CLASS[state] + ' dsa-node-circle');
        const text = document.createElementNS(ns, 'text');
        text.setAttribute('x', n.x);
        text.setAttribute('y', n.y);
        text.setAttribute('class', 'dsa-node-text');
        text.textContent = n.label;
        g.appendChild(circle);
        g.appendChild(text);
        this.svg.appendChild(g);
      });
    }
  }

  // ---- Grid renderer -----------------------------------------------
  // For DP tables and 2D scans.
  class Grid {
    constructor(container) {
      this.container = container;
      this.container.classList.add('dsa-grid-wrap');
    }

    setData(rows, cols, rowLabels = [], colLabels = []) {
      this.rows = rows;
      this.cols = cols;
      this.rowLabels = rowLabels;
      this.colLabels = colLabels;
      const table = document.createElement('table');
      table.className = 'dsa-grid-table';
      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      headRow.appendChild(document.createElement('th'));
      for (let c = 0; c < cols; c++) {
        const th = document.createElement('th');
        th.textContent = colLabels[c] !== undefined ? colLabels[c] : c;
        headRow.appendChild(th);
      }
      thead.appendChild(headRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      this.cells = [];
      for (let r = 0; r < rows; r++) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = rowLabels[r] !== undefined ? rowLabels[r] : r;
        tr.appendChild(th);
        const rowCells = [];
        for (let c = 0; c < cols; c++) {
          const td = document.createElement('td');
          td.className = 'dsa-cell dsa-grid-cell';
          tr.appendChild(td);
          rowCells.push(td);
        }
        this.cells.push(rowCells);
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      this.container.innerHTML = '';
      this.container.appendChild(table);
    }

    // values: 2D array (same shape, undefined = blank), states: { "r,c": state }
    paint(values, states = {}) {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const td = this.cells[r][c];
          const v = values[r] ? values[r][c] : undefined;
          td.textContent = v === undefined || v === null ? '' : v;
          const state = states[r + ',' + c] || 'default';
          td.className = STATE_CLASS[state] + ' dsa-grid-cell';
        }
      }
    }
  }

  // ---- CallStack renderer -----------------------------------------
  // For recursion: frames pushed top-to-bottom, popped when a call returns.
  class CallStack {
    constructor(container) {
      this.container = container;
      this.container.classList.add('dsa-callstack');
    }

    // frames: [{ label, state }] — last item renders on top (most recent call)
    render(frames) {
      this.container.innerHTML = '';
      frames
        .slice()
        .reverse()
        .forEach((f) => {
          const div = document.createElement('div');
          div.className = STATE_CLASS[f.state || 'active'] + ' dsa-frame';
          div.textContent = f.label;
          this.container.appendChild(div);
        });
      if (!frames.length) {
        const empty = document.createElement('div');
        empty.className = 'dsa-frame-empty';
        empty.textContent = '(stack empty)';
        this.container.appendChild(empty);
      }
    }
  }

  // ---- Quiz helper -----------------------------------------------
  // qEl: container with data-answer on it and .dsa-quiz-option buttons inside
  function wireQuiz(root) {
    root.querySelectorAll('.dsa-quiz').forEach((quiz) => {
      const correct = quiz.dataset.answer;
      const feedback = quiz.querySelector('.dsa-quiz-feedback');
      quiz.querySelectorAll('.dsa-quiz-option').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (quiz.dataset.answered === 'true') return;
          quiz.dataset.answered = 'true';
          const isRight = btn.dataset.value === correct;
          btn.classList.add(isRight ? 'dsa-correct' : 'dsa-wrong');
          quiz.querySelectorAll('.dsa-quiz-option').forEach((b) => {
            if (b.dataset.value === correct) b.classList.add('dsa-correct');
            b.disabled = true;
          });
          if (feedback) {
            feedback.hidden = false;
            feedback.textContent = isRight
              ? '✅ Correct! ' + (btn.dataset.explain || quiz.dataset.explain || '')
              : '❌ Not quite. ' + (quiz.dataset.explain || '');
          }
        });
      });
    });
  }

  // ---- Reveal helper (hints / solutions behind a click) -------------
  function wireReveals(root) {
    root.querySelectorAll('.dsa-reveal-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const panel = document.getElementById(btn.dataset.target);
        if (!panel) return;
        const isHidden = panel.hidden;
        panel.hidden = !isHidden;
        btn.textContent = isHidden ? btn.dataset.hideLabel || 'Hide' : btn.dataset.showLabel || btn.textContent;
        btn.setAttribute('aria-expanded', String(isHidden));
      });
    });
  }

  // ---- Syntax highlighting for <pre><code> blocks ---------------------
  // Small hand-rolled JS tokenizer — no library, no CDN. Colors match the
  // One Dark Pro tokens already used everywhere else on the site.
  const JS_KEYWORDS = new Set([
    'const', 'let', 'var', 'function', 'class', 'return', 'if', 'else', 'while', 'for',
    'new', 'this', 'extends', 'constructor', 'break', 'continue', 'typeof', 'instanceof',
    'in', 'of', 'throw', 'try', 'catch', 'finally', 'static', 'get', 'set', 'super',
    'yield', 'async', 'await', 'export', 'import', 'default', 'switch', 'case', 'void',
    'delete', 'do',
  ]);
  const JS_LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // comment | string (single/double/template) | number | identifier | anything else (1 char)
  const TOKEN_RE = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|([A-Za-z_$][\w$]*)|([\s\S])/g;

  function highlightJS(code) {
    let out = '';
    let m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
      const [, comment, str, num, ident, other] = m;
      if (comment) out += `<span class="tok-comment">${escapeHtml(comment)}</span>`;
      else if (str) out += `<span class="tok-string">${escapeHtml(str)}</span>`;
      else if (num) out += `<span class="tok-number">${escapeHtml(num)}</span>`;
      else if (ident) {
        if (JS_KEYWORDS.has(ident)) out += `<span class="tok-keyword">${escapeHtml(ident)}</span>`;
        else if (JS_LITERALS.has(ident)) out += `<span class="tok-literal">${escapeHtml(ident)}</span>`;
        else out += escapeHtml(ident);
      } else out += escapeHtml(other);
    }
    return out;
  }

  // Applied automatically on every page (see DOMContentLoaded below) — no
  // lesson file needs to call this itself.
  function highlightCode(root) {
    (root || document).querySelectorAll('pre > code').forEach((codeEl) => {
      codeEl.innerHTML = highlightJS(codeEl.textContent);
      codeEl.classList.add('dsa-hl');
    });
  }

  document.addEventListener('DOMContentLoaded', () => highlightCode(document));

  return {
    StepPlayer,
    Bars,
    Graph,
    Grid,
    CallStack,
    shuffleArray,
    randomArray,
    wireQuiz,
    wireReveals,
    highlightCode,
  };
})();
