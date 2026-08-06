window.SortingTrace = (() => {
  let activeKey = "selection";

  function safe(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function arrayCells(values) {
    if (!Array.isArray(values)) return safe(values);
    return `<div class="sort-array-row">${values.map(value => `<span class="sort-cell">${safe(value)}</span>`).join("")}</div>`;
  }

  function render() {
    renderOverview();
    renderTabs();
    renderPanel(activeKey);
    if (window.SortingTraceVisualizer) window.SortingTraceVisualizer.init();
    renderCheatSheet();
    renderPractice();
    markIfHash();
  }

  function renderOverview() {
    const target = document.getElementById("sortingOverview");
    if (!target || !window.SortingLecture) return;
    target.innerHTML = SortingLecture.overview.map(item => `
      <a class="sorting-overview-card" href="#sorting-trace-lab" data-sort-jump="${item.key}">
        <p class="eyebrow">${safe(item.pages)}</p>
        <h3>${safe(item.title)}</h3>
        <dl class="sort-card-facts">
          <div><dt>Idea</dt><dd>${safe(item.idea)}</dd></div>
          <div><dt>What to trace</dt><dd>${safe(item.trace)}</dd></div>
          <div><dt>Exam rule</dt><dd>${safe(item.exam)}</dd></div>
          <div><dt>Example array</dt><dd>${safe(item.example)}</dd></div>
          <div><dt>Key mistake to avoid</dt><dd>${safe(item.mistake)}</dd></div>
        </dl>
      </a>
    `).join("");
  }

  function renderTabs() {
    const target = document.getElementById("sortingTabs");
    if (!target || !window.SortingLecture) return;
    target.innerHTML = SortingLecture.tabs.map(([key, label]) => `
      <button class="tab-btn sorting-tab ${key === activeKey ? "active" : ""}" data-sort="${key}" type="button" role="tab">${safe(label)}</button>
    `).join("");
  }

  function renderPanel(key) {
    activeKey = key;
    const panel = document.getElementById("sortingTracePanel");
    if (!panel || !window.SortingLecture) return;
    const trace = SortingLecture.traces[key];
    if (!trace) return;
    const renderers = {
      selection: renderSelection,
      bubble: renderBubble,
      merge: renderMerge,
      insertion: renderInsertion,
      quick: renderQuick
    };
    panel.innerHTML = renderers[key](trace);
    document.querySelectorAll(".sorting-tab").forEach(button => {
      button.classList.toggle("active", button.dataset.sort === key);
    });
  }

  function renderCheckpoints(items) {
    return `<div class="sort-check-grid">${items.map(item => `<div class="mini-card">${safe(item)}</div>`).join("")}</div>`;
  }

  function traceCard(trace, eyebrow, inner) {
    return `<article class="sort-trace-card">
      <p class="eyebrow">${eyebrow}</p>
      <h3>${safe(trace.title)}</h3>
      <p>${safe(trace.rule)}</p>
      ${inner}
      ${renderCheckpoints(trace.checkpoints)}
    </article>`;
  }

  function traceTable(headers, rows) {
    return `<div class="trace-table-wrap">
      <table class="trace-table">
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.join("")}</tbody>
      </table>
    </div>`;
  }

  function renderSelection(trace) {
    const table = traceTable(["Pass", "Action", "Array after pass"],
      trace.rows.map(row => `<tr><td>${safe(row[0])}</td><td>${safe(row[1])}</td><td>${arrayCells(row[2])}</td></tr>`));
    return traceCard(trace, "Selection Sort", table);
  }

  function renderBubble(trace) {
    const examples = trace.examples.map(ex => `
      <section class="sort-example-block">
        <h4>${safe(ex.title)}</h4>
        ${traceTable(["Step / Pass", "Action", "Array after step"],
          ex.rows.map(row => `<tr><td>${safe(row[0])}</td><td>${safe(row[1])}</td><td>${arrayCells(row[2])}</td></tr>`))}
      </section>`).join("");
    return traceCard(trace, "Bubble Sort", examples);
  }

  function renderMerge(trace) {
    const examples = trace.examples.map(ex => `
      <section class="sort-example-block merge-block">
        <h4>${safe(ex.title)}</h4>
        <div class="merge-levels">
          ${ex.rows.map(row => `<div class="merge-level"><strong>${safe(row[0])}</strong><span>${safe(row[1])}</span></div>`).join("")}
        </div>
      </section>`).join("");
    return traceCard(trace, "Merge Sort", examples);
  }

  function renderInsertion(trace) {
    const examples = trace.examples.map(ex => `
      <section class="sort-example-block">
        <h4>${safe(ex.title)}</h4>
        ${traceTable(["Pass", "Key", "Array after pass", "Positions moved"],
          ex.rows.map(row => `<tr><td>${safe(row[0])}</td><td>${safe(row[1])}</td><td>${arrayCells(row[2])}</td><td>${safe(row[3])}</td></tr>`))}
        ${ex.shift ? `<div class="shift-strip">${ex.shift.map(step => `<span>${safe(step)}</span>`).join("")}</div>` : ""}
      </section>`).join("");
    return traceCard(trace, "Insertion Sort", examples);
  }

  function renderQuick(trace) {
    const partitionTable = traceTable(["Step", "Action", "Array after step"],
      trace.firstPartition.map(row => `<tr><td>${safe(row[0])}</td><td>${safe(row[1])}</td><td>${arrayCells(row[2])}</td></tr>`));
    const recursiveTable = traceTable(["Range", "Pivot", "Partition result"],
      trace.recursiveRows.map(row => `<tr><td>${safe(row[0])}</td><td>${safe(row[1])}</td><td>${safe(row[2])}</td></tr>`));
    const inner = `<div class="exam-check"><strong>Partition rule:</strong> ${safe(trace.partitionRule)}</div>
      <section class="sort-example-block">
        <h4>First partition trace</h4>
        ${partitionTable}
      </section>
      <section class="sort-example-block">
        <h4>Recursive partition summary</h4>
        ${recursiveTable}
      </section>`;
    return traceCard(trace, "Quick Sort", inner);
  }

  function renderCheatSheet() {
    const target = document.getElementById("sortingCheatSheet");
    if (!target || !window.SortingLecture) return;
    target.innerHTML = SortingLecture.cheat.map(([title, text]) =>
      simpleCard("cheat-card", title, text)
    ).join("");
  }

  function renderPractice() {
    const target = document.getElementById("sortingPractice");
    if (!target || !window.SortingLecture) return;
    target.innerHTML = SortingLecture.practice.map((item, i) =>
      buildQuizCard(item, i, `sorting-answer-${i}`, "sorting-answer", "sorting-choice")
    ).join("");
  }

  function bind() {
    document.addEventListener("click", event => {
      const sortTab = event.target.closest(".sorting-tab");
      if (sortTab) renderPanel(sortTab.dataset.sort);

      const sortJump = event.target.closest("[data-sort-jump]");
      if (sortJump) {
        renderPanel(sortJump.dataset.sortJump);
        if (window.TreeStorage) TreeStorage.markChunk("sorting");
      }

      const answer = event.target.closest(".sorting-answer");
      if (answer) {
        const el = document.getElementById(`sorting-answer-${answer.dataset.index}`);
        if (el) el.hidden = !el.hidden;
      }

      const choice = event.target.closest(".sorting-choice");
      if (choice && window.SortingLecture) {
        const item = SortingLecture.practice[Number(choice.dataset.index)];
        const card = choice.closest(".quiz-card");
        card.classList.remove("correct", "wrong");
        card.classList.add(choice.dataset.answer === item.answer ? "correct" : "wrong");
        const el = document.getElementById(`sorting-answer-${choice.dataset.index}`);
        if (el) el.hidden = false;
      }
    });

    document.querySelectorAll('a[href="#sorting"], a[href="#sorting-trace-lab"], a[href="#sorting-cheat-sheet"], a[href="#sorting-practice"]').forEach(link => {
      link.addEventListener("click", () => {
        if (window.TreeStorage) TreeStorage.markChunk("sorting");
      });
    });
  }

  function markIfHash() {
    if (location.hash.startsWith("#sorting") && window.TreeStorage) TreeStorage.markChunk("sorting");
  }

  function searchDocs() {
    if (!window.SortingLecture) return [];
    const overviewDocs = SortingLecture.overview.map(item => ({
      title: item.title,
      text: `${item.idea} ${item.exam} ${item.pages}`,
      href: "#sorting"
    }));
    const traceDocs = Object.values(SortingLecture.traces).flatMap(trace => {
      const core = `${trace.title} ${trace.rule} ${(trace.checkpoints || []).join(" ")}`;
      return [{ title: trace.title, text: core, href: "#sorting-trace-lab" }];
    });
    const practiceDocs = SortingLecture.practice.map(item => ({
      title: item.q,
      text: `${item.answer} ${(item.choices || []).join(" ")}`,
      href: "#sorting-practice"
    }));
    return [
      { title: "Sorting Algorithms Trace", text: SortingLecture.searchKeywords, href: "#sorting" },
      ...overviewDocs,
      ...traceDocs,
      ...practiceDocs
    ];
  }

  return { render, bind, renderPanel, searchDocs, safe };
})();

window.SortingTraceVisualizer = (() => {
  const examples = {
    selection: "16, 30, 24, 7, 62, 45, 5, 55",
    bubble: "5, 1, 2, 4, 3, 7, 6",
    insertion: "29, 10, 14, 37, 13",
    merge: "35, 28, 18, 45, 62, 48, 30, 38",
    quick: "35, 28, 18, 45, 62, 48, 30, 38"
  };

  const state = { steps: [], index: 0, timer: null, ready: false };

  function parseArray(value) {
    const parsed = value.split(",").map(item => Number(item.trim())).filter(Number.isFinite);
    return parsed.length ? parsed.slice(0, 16) : examples.selection.split(",").map(Number);
  }

  function clone(array) {
    return array.slice();
  }

  function range(start, end) {
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  }

  function step(array, action, note, options = {}) {
    return {
      array: clone(array),
      action,
      note,
      compare: options.compare || [],
      swap: options.swap || [],
      sorted: options.sorted || [],
      pivot: options.pivot ?? null,
      groups: options.groups || []
    };
  }

  function selectionTrace(input) {
    const a = clone(input);
    const steps = [step(a, "Start trace", "Selection Sort repeatedly selects the smallest value from the unsorted part and fixes it at the front.")];
    const fixed = [];
    for (let i = 0; i < a.length - 1; i += 1) {
      let min = i;
      steps.push(step(a, `Pass ${i + 1}: assume ${a[i]} is minimum`, `Position ${i} is the next fixed position; scan the unsorted part to find the smallest value.`, { sorted: clone(fixed), compare: [i] }));
      for (let j = i + 1; j < a.length; j += 1) {
        steps.push(step(a, `Compare ${a[min]} and ${a[j]}`, a[j] < a[min] ? `${a[j]} is smaller, so it becomes the current minimum candidate.` : `${a[min]} remains the minimum candidate for this pass.`, { compare: [min, j], sorted: clone(fixed) }));
        if (a[j] < a[min]) min = j;
      }
      [a[i], a[min]] = [a[min], a[i]];
      fixed.push(i);
      steps.push(step(a, min === i ? `No swap needed for position ${i}` : `Swap minimum into position ${i}`, `After the pass, index ${i} is fixed and will not change again.`, { swap: min === i ? [] : [i, min], sorted: clone(fixed) }));
    }
    steps.push(step(a, "Trace complete", "All positions are fixed; the array is sorted in ascending order.", { sorted: range(0, a.length - 1) }));
    return steps;
  }

  function bubbleTrace(input) {
    const a = clone(input);
    const steps = [step(a, "Start trace", "Bubble Sort compares adjacent values; the larger value moves toward the bottom/end of the array each pass.")];
    const fixed = [];
    for (let end = a.length - 1; end > 0; end -= 1) {
      for (let i = 0; i < end; i += 1) {
        steps.push(step(a, `Compare adjacent ${a[i]} and ${a[i + 1]}`, a[i] > a[i + 1] ? `${a[i]} is larger, so it must move right toward the end.` : `They are already in order, so no swap is needed.`, { compare: [i, i + 1], sorted: clone(fixed) }));
        if (a[i] > a[i + 1]) {
          [a[i], a[i + 1]] = [a[i + 1], a[i]];
          steps.push(step(a, "Swap adjacent values", "The larger element has moved one position closer to its final end position.", { swap: [i, i + 1], sorted: clone(fixed) }));
        }
      }
      fixed.push(end);
      steps.push(step(a, `Pass fixed index ${end}`, `The largest remaining value reached the end of the unsorted part, so index ${end} is fixed.`, { sorted: clone(fixed) }));
    }
    steps.push(step(a, "Trace complete", "Every pass fixed one more value at the end; the array is sorted.", { sorted: range(0, a.length - 1) }));
    return steps;
  }

  function insertionTrace(input) {
    const a = clone(input);
    const steps = [step(a, "Start trace", "Insertion Sort keeps the left side sorted and inserts the next key into its correct position.", { sorted: [0] })];
    for (let p = 1; p < a.length; p += 1) {
      const key = a[p];
      let j = p - 1;
      steps.push(step(a, `Copy key ${key}`, `Treat indexes 0 to ${p - 1} as the sorted part; place ${key} inside that sorted part.`, { compare: [p], sorted: range(0, p - 1) }));
      while (j >= 0 && a[j] > key) {
        steps.push(step(a, `Compare ${a[j]} with key ${key}`, `${a[j]} is larger than the key, so shift it one position to the right.`, { compare: [j, j + 1], sorted: range(0, p - 1) }));
        a[j + 1] = a[j];
        steps.push(step(a, `Shift ${a[j]} right`, "A larger sorted-part value moves right to make room for the key.", { swap: [j, j + 1], sorted: range(0, p) }));
        j -= 1;
      }
      a[j + 1] = key;
      steps.push(step(a, `Insert key ${key}`, `The key is inserted at index ${j + 1}; indexes 0 to ${p} are now sorted.`, { sorted: range(0, p), swap: [j + 1] }));
    }
    steps.push(step(a, "Trace complete", "The sorted portion grew one key at a time until it covered the whole array.", { sorted: range(0, a.length - 1) }));
    return steps;
  }

  function mergeTrace(input) {
    const steps = [step(input, "Start trace", "Merge Sort first divides the array into smaller groups, then merges sorted groups back together.", { groups: [{ start: 0, end: input.length - 1 }] })];
    function divide(start, end) {
      if (start >= end) {
        steps.push(step(input, `Single item group [${input[start]}]`, "A one-item group is already sorted.", { groups: [{ start, end }] }));
        return [input[start]];
      }
      const mid = Math.floor((start + end) / 2);
      steps.push(step(input, `Divide indexes ${start}-${end}`, `Split this group into indexes ${start}-${mid} and ${mid + 1}-${end}.`, { groups: [{ start, end }, { start, end: mid }, { start: mid + 1, end }] }));
      const left = divide(start, mid);
      const right = divide(mid + 1, end);
      const merged = [];
      let i = 0;
      let j = 0;
      while (i < left.length || j < right.length) {
        if (j >= right.length || (i < left.length && left[i] <= right[j])) merged.push(left[i++]);
        else merged.push(right[j++]);
      }
      const view = input.slice();
      merged.forEach((value, offset) => { view[start + offset] = value; });
      steps.push(step(view, `Merge [${left.join(", ")}] and [${right.join(", ")}]`, `Choose the smaller front value each time; merged indexes ${start}-${end} become [${merged.join(", ")}].`, { sorted: range(start, end), groups: [{ start, end }] }));
      return merged;
    }
    const result = divide(0, input.length - 1);
    steps.push(step(result, "Trace complete", "All merge levels are complete; the final merged group is the sorted array.", { sorted: range(0, result.length - 1), groups: [{ start: 0, end: result.length - 1 }] }));
    return steps;
  }

  function quickTrace(input) {
    const a = clone(input);
    const fixed = [];
    const steps = [step(a, "Start trace", "Quick Sort partitions around a pivot, then repeats the trace on the left and right subarrays.")];
    function partition(low, high) {
      if (low > high) return;
      if (low === high) {
        fixed.push(low);
        steps.push(step(a, `Single item at index ${low}`, "A one-item subarray is already fixed.", { sorted: clone(fixed) }));
        return;
      }
      const mid = Math.floor((low + high) / 2);
      [a[low], a[mid]] = [a[mid], a[low]];
      const pivotValue = a[low];
      steps.push(step(a, `Choose pivot ${pivotValue}`, `Swap the first element of the subarray with the middle element; the pivot is now at index ${low}.`, { pivot: low, swap: low === mid ? [] : [low, mid], groups: [{ start: low, end: high }] }));
      let left = low + 1;
      let right = high;
      while (left <= right) {
        while (left <= right && a[left] < pivotValue) {
          steps.push(step(a, `${a[left]} is less than pivot ${pivotValue}`, "This value belongs in the smaller-than-pivot area, so move the left scan forward.", { compare: [left], pivot: low, sorted: clone(fixed) }));
          left += 1;
        }
        while (left <= right && a[right] > pivotValue) {
          steps.push(step(a, `${a[right]} is greater than pivot ${pivotValue}`, "This value belongs in the greater-than-pivot area, so move the right scan backward.", { compare: [right], pivot: low, sorted: clone(fixed) }));
          right -= 1;
        }
        if (left <= right) {
          steps.push(step(a, `Swap ${a[left]} and ${a[right]}`, "The left side found a large value and the right side found a small value; swap them across the pivot boundary.", { compare: [left, right], pivot: low, sorted: clone(fixed) }));
          [a[left], a[right]] = [a[right], a[left]];
          steps.push(step(a, "Partition swap complete", "Values are closer to the correct side of the pivot.", { swap: [left, right], pivot: low, sorted: clone(fixed) }));
          left += 1;
          right -= 1;
        }
      }
      [a[low], a[right]] = [a[right], a[low]];
      fixed.push(right);
      steps.push(step(a, `Place pivot ${pivotValue}`, `The pivot is fixed at index ${right}; smaller values are on the left and larger values are on the right.`, { pivot: right, swap: [low, right], sorted: clone(fixed), groups: [{ start: low, end: right - 1 }, { start: right + 1, end: high }] }));
      partition(low, right - 1);
      partition(right + 1, high);
    }
    partition(0, a.length - 1);
    steps.push(step(a, "Trace complete", "Every partition has placed its pivot in a fixed position; the array is sorted.", { sorted: range(0, a.length - 1) }));
    return steps;
  }

  function generateSteps() {
    const algorithm = document.getElementById("sortingD3Algorithm").value;
    const input = parseArray(document.getElementById("sortingD3Input").value);
    const generators = { selection: selectionTrace, bubble: bubbleTrace, insertion: insertionTrace, merge: mergeTrace, quick: quickTrace };
    state.steps = generators[algorithm](input);
    state.index = 0;
    render();
  }

  function currentStep() {
    return state.steps[state.index] || state.steps[0];
  }

  function render() {
    const item = currentStep();
    if (!item) return;
    const counter = document.getElementById("sortingD3Counter");
    const explanation = document.getElementById("sortingD3Explanation");
    if (counter) counter.textContent = `Step ${state.index + 1} / ${state.steps.length}`;
    if (explanation) explanation.innerHTML = `<strong>Current step: ${SortingTrace.safe(item.action)}</strong><p>${SortingTrace.safe(item.note)}</p>`;
    renderSvg(item);
    renderTable();
  }

  function renderSvg(item) {
    const svgNode = document.getElementById("sortingD3Svg");
    const wrap = document.getElementById("sortingD3SvgWrap");
    if (!svgNode || !wrap || !window.d3) return;
    const width = Math.max(wrap.clientWidth, 300);
    const height = 280;
    const margin = { top: 36, right: 16, bottom: 54, left: 16 };
    const innerWidth = width - margin.left - margin.right;
    const max = Math.max(...item.array, 1);
    const cellWidth = Math.max(28, innerWidth / item.array.length);
    const barWidth = Math.max(22, cellWidth - 10);
    const y = d3.scaleLinear().domain([0, max]).range([height - margin.bottom, margin.top]);
    const svg = d3.select(svgNode).attr("viewBox", `0 0 ${width} ${height}`);
    svg.selectAll("*").remove();

    (item.groups || []).filter(group => group.start <= group.end).forEach((group, groupIndex) => {
      svg.append("rect")
        .attr("class", "sort-d3-group")
        .attr("x", margin.left + group.start * cellWidth + 2)
        .attr("y", 18 + groupIndex * 7)
        .attr("width", Math.max(cellWidth, (group.end - group.start + 1) * cellWidth - 4))
        .attr("height", height - 34 - groupIndex * 7)
        .attr("rx", 8);
    });

    const bars = svg.append("g").selectAll("g").data(item.array.map((value, index) => ({ value, index }))).join("g")
      .attr("transform", d => `translate(${margin.left + d.index * cellWidth + (cellWidth - barWidth) / 2},0)`);

    bars.append("rect")
      .attr("class", d => {
        const classes = ["sort-d3-bar"];
        if (item.sorted.includes(d.index)) classes.push("sorted");
        if (item.compare.includes(d.index)) classes.push("compare");
        if (item.swap.includes(d.index)) classes.push("swap");
        if (item.pivot === d.index) classes.push("pivot");
        return classes.join(" ");
      })
      .attr("x", 0)
      .attr("y", d => y(d.value))
      .attr("width", barWidth)
      .attr("height", d => height - margin.bottom - y(d.value))
      .attr("rx", 7);

    bars.append("text")
      .attr("class", "sort-d3-value")
      .attr("x", barWidth / 2)
      .attr("y", d => Math.min(y(d.value) - 8, height - margin.bottom - 10))
      .text(d => d.value);

    bars.append("text")
      .attr("class", "sort-d3-index")
      .attr("x", barWidth / 2)
      .attr("y", height - 24)
      .text(d => d.index);
  }

  function renderTable() {
    const body = document.getElementById("sortingD3TableBody");
    if (!body) return;
    body.innerHTML = state.steps.map((item, index) => `
      <tr class="${index === state.index ? "active" : ""}" data-step="${index}">
        <td>${index + 1}</td>
        <td>${SortingTrace.safe(item.action)}</td>
        <td><div class="sort-array-row">${item.array.map(value => `<span class="sort-cell">${SortingTrace.safe(value)}</span>`).join("")}</div></td>
        <td>${SortingTrace.safe(item.note)}</td>
      </tr>
    `).join("");
  }

  function setStep(index) {
    state.index = Math.max(0, Math.min(index, state.steps.length - 1));
    render();
  }

  function pause() {
    window.clearInterval(state.timer);
    state.timer = null;
    const play = document.getElementById("sortingD3Play");
    if (play) {
      play.textContent = "Auto Play";
      play.setAttribute("aria-pressed", "false");
    }
  }

  function play() {
    if (state.timer) {
      pause();
      return;
    }
    const playButton = document.getElementById("sortingD3Play");
    if (playButton) {
      playButton.textContent = "Pause";
      playButton.setAttribute("aria-pressed", "true");
    }
    state.timer = window.setInterval(() => {
      if (state.index >= state.steps.length - 1) {
        pause();
        return;
      }
      setStep(state.index + 1);
    }, 1100);
  }

  function init() {
    if (state.ready) return;
    const form = document.getElementById("sortingD3Controls");
    const algorithm = document.getElementById("sortingD3Algorithm");
    const input = document.getElementById("sortingD3Input");
    if (!form || !algorithm || !input) return;
    state.ready = true;
    algorithm.addEventListener("change", () => {
      pause();
      input.value = examples[algorithm.value];
      generateSteps();
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      pause();
      generateSteps();
    });
    document.getElementById("sortingD3Prev").addEventListener("click", () => { pause(); setStep(state.index - 1); });
    document.getElementById("sortingD3Next").addEventListener("click", () => { pause(); setStep(state.index + 1); });
    document.getElementById("sortingD3Reset").addEventListener("click", () => { pause(); setStep(0); });
    document.getElementById("sortingD3Play").addEventListener("click", play);
    document.getElementById("sortingD3TableBody").addEventListener("click", event => {
      const row = event.target.closest("[data-step]");
      if (row) {
        pause();
        setStep(Number(row.dataset.step));
      }
    });
    window.addEventListener("resize", () => render());
    generateSteps();
  }

  return { init, generateSteps };
})();
