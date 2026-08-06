document.addEventListener("DOMContentLoaded", () => {
  renderChunks();
  renderCode();
  renderPractice();
  renderCheatSheet();
  renderAlgorithmLecture();
  if (window.SortingTrace) SortingTrace.render();
  bindTabs();
  bindVisualControls();
  bindBigOVisualizer();
  if (window.SortingTrace) SortingTrace.bind();
  TreeQuiz.render();
  TreeSearch.init();
  TreeD3.init();
  updateProgress();
  initScrollSpy();
  initBackToTop();
});

function renderChunks() {
  const list = document.getElementById("chunkList");
  list.innerHTML = TreeLecture.chunks.map((chunk, index) => `
    <details class="chunk-card" id="${chunk.id}" ${index === 0 ? "open" : ""}>
      <summary>
        <span>${chunk.title}</span>
        <small>${chunk.pages}</small>
      </summary>
      <div class="chunk-body">
        <p>${chunk.en}</p>
        <p class="ar" dir="rtl">${chunk.ar}</p>
        <div class="mini-grid">
          ${chunk.bullets.map(item => `<div class="mini-card">${item}</div>`).join("")}
        </div>
        <div class="exam-check"><strong>Quick exam check:</strong> ${chunk.check}</div>
      </div>
    </details>
  `).join("");

  list.querySelectorAll("details").forEach(detail => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        TreeStorage.markChunk(detail.id);
        updateProgress();
      }
    });
  });
  TreeStorage.markChunk("chunk-1");
}

function renderCode() {
  document.getElementById("codeBlocks").innerHTML = TreeLecture.code.map(([title, code]) => `
    <article class="code-card">
      <h3>${title}</h3>
      <pre><code>${escapeHtml(code)}</code></pre>
    </article>
  `).join("");
}

function renderPractice() {
  document.getElementById("tracePractice").innerHTML = TreeLecture.practice.map(([title, text]) =>
    simpleCard("practice-card", title, text)
  ).join("");
}

function renderCheatSheet() {
  document.getElementById("cheatSheet").innerHTML = TreeLecture.cheat.map(([title, text]) =>
    simpleCard("cheat-card", title, text)
  ).join("");
}

function simpleCard(cls, title, text) {
  return `<article class="${cls}"><h3>${title}</h3><p>${text}</p></article>`;
}

function bindTabs() {
  document.querySelectorAll(".tab-btn[data-tab]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn[data-tab]").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      document.getElementById(`tab-${button.dataset.tab}`).classList.add("active");
      setTimeout(() => TreeD3.init(), 20);
    });
  });
}

function bindVisualControls() {
  document.getElementById("runBinary").addEventListener("click", () => {
    TreeD3.binarySearch(Number(document.getElementById("binaryTarget").value));
  });

  document.getElementById("runBstSearch").addEventListener("click", () => {
    TreeD3.searchBst(Number(document.getElementById("bstTarget").value));
  });

  document.getElementById("runInsert").addEventListener("click", () => {
    const values = document.getElementById("insertValues").value.split(",").map(v => Number(v.trim())).filter(Number.isFinite);
    TreeD3.insertBST(values);
  });

  document.getElementById("resetInsert").addEventListener("click", () => {
    document.getElementById("insertValues").value = "8,5,11,2,7,9,12,6,10,13";
    TreeD3.init();
    document.getElementById("insertLog").innerHTML = "";
  });

  document.querySelectorAll("[data-traversal]").forEach(button => {
    button.addEventListener("click", () => TreeD3.animateTraversal(button.dataset.traversal));
  });
}

function updateProgress() {
  const data = TreeStorage.read();
  const target = document.getElementById("progressChunks");
  const total = TreeLecture.chunks.length + 2;
  if (target) target.textContent = `${data.opened.length}/${total}`;
  const count = document.getElementById("lectureCount");
  if (count) count.textContent = total;
  TreeQuiz.updateScore();
}

function renderAlgorithmLecture() {
  renderTraceMethod();
  renderAlgorithmChunks();
  renderRecognitionTable();
  renderBigOCheatSheet();
  renderBigOPractice();
  renderBigOVisualizer("linear");
  document.querySelectorAll('a[href="#big-o"], a[href="#big-o-practice"], a[href="#big-o-visualizer"]').forEach(link => {
    link.addEventListener("click", () => {
      TreeStorage.markChunk("big-o");
      updateProgress();
    });
  });
  if (location.hash.startsWith("#big-o")) TreeStorage.markChunk("big-o");
}

function renderTraceMethod() {
  const target = document.getElementById("bigOTraceMethod");
  if (!target) return;
  target.innerHTML = `
    <h3>Exam Trace Method</h3>
    <ol>
      ${TreeLecture.algorithm.method.map(step => `<li>${step}</li>`).join("")}
    </ol>
  `;
}

function renderAlgorithmChunks() {
  const target = document.getElementById("bigOChunks");
  if (!target) return;
  target.innerHTML = TreeLecture.algorithm.chunks.map((chunk, index) => `
    <article class="algorithm-card ${chunk.title.includes("Trap") ? "trap-card" : ""}">
      <p class="eyebrow">Topic ${index + 1}</p>
      <h3>${chunk.title}</h3>
      <p><strong>Pattern:</strong> ${chunk.pattern}</p>
      ${chunk.code ? `<pre><code>${escapeHtml(chunk.code)}</code></pre>` : ""}
      <ul>
        ${chunk.trace.map(item => `<li>${item}</li>`).join("")}
      </ul>
      <div class="exam-check"><strong>Result:</strong> ${chunk.result}</div>
    </article>
  `).join("");
}

function renderRecognitionTable() {
  const target = document.getElementById("bigORecognition");
  if (!target) return;
  target.innerHTML = TreeLecture.algorithm.recognition.map(([pattern, result]) => `
    <div class="recognition-row">
      <span>${pattern}</span>
      <strong>${result}</strong>
    </div>
  `).join("");
}

function renderBigOCheatSheet() {
  const target = document.getElementById("bigOCheatSheet");
  if (!target) return;
  target.innerHTML = `
    <figcaption>Algorithm Analysis Big O cheat sheet</figcaption>
  `;
}

function buildQuizCard(item, index, answerId, btnClass, choiceClass) {
  const choices = item.choices
    ? `<div class="choice-list">${item.choices.map(c => `<button class="choice ${choiceClass}" data-answer="${c}" data-index="${index}" type="button">${c}</button>`).join("")}</div>`
    : "";
  return `<article class="quiz-card">
    <p class="eyebrow">${item.type.toUpperCase()}</p>
    <h3>${item.q}</h3>
    ${choices}
    <button class="btn ghost ${btnClass}" data-index="${index}" type="button">Show Answer</button>
    <p class="answer" id="${answerId}" hidden>${item.answer}${item.why ? ` — ${item.why}` : ""}</p>
  </article>`;
}

function renderBigOPractice() {
  const target = document.getElementById("bigOPractice");
  if (!target) return;
  target.innerHTML = TreeLecture.algorithm.practice.map((item, i) =>
    buildQuizCard(item, i, `big-o-answer-${i}`, "big-o-answer", "big-o-choice")
  ).join("");
  bindBigOPractice();
}

function bindBigOPractice() {
  document.querySelectorAll(".big-o-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = TreeLecture.algorithm.practice[Number(btn.dataset.index)];
      const card = btn.closest(".quiz-card");
      card.classList.remove("correct", "wrong");
      card.classList.add(btn.dataset.answer === item.answer ? "correct" : "wrong");
      document.getElementById(`big-o-answer-${btn.dataset.index}`).hidden = false;
    });
  });
  document.querySelectorAll(".big-o-answer").forEach(btn => {
    btn.addEventListener("click", () => {
      const el = document.getElementById(`big-o-answer-${btn.dataset.index}`);
      el.hidden = !el.hidden;
    });
  });
}

function bindBigOVisualizer() {
  document.querySelectorAll(".big-o-tab").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".big-o-tab").forEach(tab => {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
      renderBigOVisualizer(button.dataset.complexity);
    });
  });
}

function renderBigOVisualizer(type) {
  const target = document.getElementById("bigOVisualizer");
  if (!target) return;
  const linear = Array.from({ length: 10 }, (_, index) => `<span>${index + 1}</span>`).join("");
  const grid = Array.from({ length: 25 }, (_, index) => `<span>${index + 1}</span>`).join("");
  const log = ["n", "n/2", "n/4", "n/8", "1"].map(step => `<span>${step}</span>`).join("");
  const tree = `
    <div class="branch-tree">
      <span>fib(4)</span>
      <div><span>fib(3)</span><span>fib(2)</span></div>
      <div><span>fib(2)</span><span>fib(1)</span><span>fib(1)</span><span>fib(0)</span></div>
    </div>
  `;
  const views = {
    linear: `<h3>O(n): one row of n operations</h3><div class="op-row">${linear}</div>`,
    quadratic: `<h3>O(n²): n by n grid</h3><div class="op-grid">${grid}</div>`,
    log: `<h3>O(log n): halving steps</h3><div class="halving-row">${log}</div>`,
    exponential: `<h3>O(2ⁿ): branching recursion tree</h3>${tree}`
  };
  target.innerHTML = views[type] || views.linear;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function initScrollSpy() {
  const navLinks = document.querySelectorAll(".top-nav a[data-nav]");
  if (!navLinks.length || !("IntersectionObserver" in window)) return;
  const sectionIds = Array.from(navLinks).map(a => a.dataset.nav);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle("active", a.dataset.nav === entry.target.id));
      }
    });
  }, { rootMargin: "-20% 0px -75% 0px" });
  sections.forEach(section => observer.observe(section));
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  const toggle = () => { btn.hidden = window.scrollY < 600; };
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  toggle();
}
