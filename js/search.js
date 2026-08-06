window.TreeSearch = (() => {
  function corpus() {
    const chunkDocs = TreeLecture.chunks.map(c => ({
      title: c.title,
      text: `${c.en} ${c.ar} ${c.bullets.join(" ")} ${c.check}`,
      href: `#${c.id}`
    }));
    const codeDocs = TreeLecture.code.map(c => ({ title: c[0], text: c[1], href: "#code" }));
    const practiceDocs = TreeLecture.practice.map(p => ({ title: p[0], text: p[1], href: "#practice" }));
    const cheatDocs = TreeLecture.cheat.map(c => ({ title: c[0], text: c[1], href: "#cheat-sheet" }));
    const algorithmDocs = TreeLecture.algorithm.chunks.map(c => ({
      title: c.title,
      text: `${c.pattern} ${c.trace.join(" ")} ${c.result} ${c.code || ""}`,
      href: "#big-o"
    }));
    const algorithmPracticeDocs = TreeLecture.algorithm.practice.map(p => ({
      title: p.q,
      text: `${p.answer} ${p.why || ""} ${(p.choices || []).join(" ")}`,
      href: "#big-o-practice"
    }));
    const algorithmTableDocs = TreeLecture.algorithm.recognition.map(r => ({
      title: r[0],
      text: r.join(" "),
      href: "#big-o-table"
    }));
    const sortingDocs = window.SortingTrace ? SortingTrace.searchDocs() : [];
    return [...chunkDocs, ...codeDocs, ...practiceDocs, ...cheatDocs, {
      title: "Algorithm Analysis Big O",
      text: TreeLecture.algorithm.searchKeywords,
      href: "#big-o"
    }, ...algorithmDocs, ...algorithmPracticeDocs, ...algorithmTableDocs, ...sortingDocs, {
      title: "Arabic keywords",
      text: TreeLecture.searchKeywords,
      href: "#chunks"
    }];
  }

  function init() {
    const input = document.getElementById("searchBox");
    const results = document.getElementById("searchResults");
    if (!input || !results) return;

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = "";
        return;
      }

      const matches = corpus().filter(doc => `${doc.title} ${doc.text}`.toLowerCase().includes(q)).slice(0, 10);
      results.innerHTML = matches.length ? matches.map(doc => `
        <a class="result-card" href="${doc.href}">
          <strong>${doc.title}</strong>
          <span>${doc.text.slice(0, 170)}...</span>
        </a>
      `).join("") : `<p class="muted">No match found.</p>`;
    });
  }

  return { init };
})();
