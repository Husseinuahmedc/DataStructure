window.TreeD3 = (() => {
  const anatomy = {
    name: "A", children: [
      { name: "B", children: [{ name: "D" }, { name: "E" }] },
      { name: "C", children: [{ name: "F" }, { name: "G" }] }
    ]
  };

  const arrayValues = ["A", "B", "C", "D", "E", "F", "G", "-", "-", "H", "I", "-", "-", "J", "-"];
  const traversalTree = {
    name: "F", children: [
      { name: "B", children: [{ name: "A" }, { name: "D", children: [{ name: "C" }, { name: "E" }] }] },
      { name: "G", children: [null, { name: "I", children: [{ name: "H" }] }] }
    ]
  };
  const starterBst = {
    name: "8", children: [
      { name: "5", children: [{ name: "2" }, { name: "7", children: [{ name: "6" }] }] },
      { name: "11", children: [{ name: "9" }, { name: "12", children: [null, { name: "13" }] }] }
    ]
  };

  const state = { instances: {}, bstRoot: null };

  function cleanChildren(node) {
    if (!node || !node.children) return node;
    node.children = node.children.filter(Boolean).map(cleanChildren);
    return node;
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function renderTree(container, data, options = {}) {
    const el = typeof container === "string" ? document.querySelector(container) : container;
    if (!el || !window.d3) return null;
    el.innerHTML = "";

    const width = Math.max(el.clientWidth, 320);
    const height = options.height || 360;
    const svg = d3.select(el).append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", options.label || "Tree diagram");

    const root = d3.hierarchy(cleanChildren(clone(data)));
    d3.tree().size([width - 70, height - 90])(root);

    svg.append("g").attr("transform", "translate(35,45)")
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("class", "tree-link")
      .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));

    const nodes = svg.append("g").attr("transform", "translate(35,45)")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("class", "tree-node")
      .attr("data-value", d => d.data.name)
      .attr("data-index", d => d.data.index ?? "")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .on("click", (_, d) => {
        if (options.onNodeClick) options.onNodeClick(d.data);
      });

    nodes.append("circle").attr("r", options.radius || 22);
    nodes.append("text").attr("dy", "0.35em").text(d => options.showIndex && d.data.index !== undefined ? `${d.data.name}:${d.data.index}` : d.data.name);

    const id = el.id || Math.random().toString(16);
    state.instances[id] = { svg, el };
    return state.instances[id];
  }

  function highlightPath(container, values, delay = 520) {
    const el = typeof container === "string" ? document.querySelector(container) : container;
    if (!el) return;
    el.querySelectorAll(".tree-node").forEach(n => n.classList.remove("active", "visited"));
    values.forEach((value, index) => {
      setTimeout(() => {
        const node = el.querySelector(`.tree-node[data-value="${value}"]`);
        if (node) {
          node.classList.add("active");
          setTimeout(() => node.classList.add("visited"), delay - 80);
        }
      }, index * delay);
    });
  }

  function arrayTreeData() {
    const nodes = arrayValues.map((value, index) => value === "-" ? null : { name: value, index });
    nodes.forEach((node, index) => {
      if (!node) return;
      const left = nodes[2 * index + 1];
      const right = nodes[2 * index + 2];
      node.children = [left, right].filter(Boolean);
    });
    return nodes[0];
  }

  function renderArrayRepresentation() {
    renderTree("#arrayTree", arrayTreeData(), {
      showIndex: true,
      onNodeClick: node => selectArrayIndex(node.index)
    });

    const row = document.getElementById("arrayRow");
    row.innerHTML = arrayValues.map((value, index) => `
      <button class="array-cell" data-index="${index}" aria-label="Index ${index}, value ${value}">
        <span>${index}</span><strong>${value}</strong>
      </button>
    `).join("");

    row.querySelectorAll(".array-cell").forEach(cell => {
      cell.addEventListener("click", () => selectArrayIndex(Number(cell.dataset.index)));
    });
  }

  function selectArrayIndex(index) {
    document.querySelectorAll(".array-cell").forEach(c => c.classList.toggle("selected", Number(c.dataset.index) === index));
    document.querySelectorAll("#arrayTree .tree-node").forEach(n => n.classList.toggle("active", Number(n.dataset.index) === index));
  }

  function toNode(value) {
    return { name: String(value), children: [] };
  }

  function insertValue(root, value, log) {
    if (!root) {
      log.push(`insert ${value} at root`);
      return toNode(value);
    }
    let current = root;
    while (current) {
      const cur = Number(current.name);
      if (value < cur) {
        log.push(`${value} < ${cur} -> left`);
        if (!current.children[0]) {
          current.children[0] = toNode(value);
          log.push(`insert ${value} as left child of ${cur}`);
          break;
        }
        current = current.children[0];
      } else {
        log.push(`${value} > ${cur} -> right`);
        if (!current.children[1]) {
          current.children[1] = toNode(value);
          log.push(`insert ${value} as right child of ${cur}`);
          break;
        }
        current = current.children[1];
      }
    }
    return root;
  }

  function insertBST(values) {
    const log = [];
    state.bstRoot = null;
    values.forEach(value => {
      state.bstRoot = insertValue(state.bstRoot, value, log);
      renderTree("#insertTree", state.bstRoot);
    });
    document.getElementById("insertLog").innerHTML = log.map(x => `<li>${x}</li>`).join("");
    highlightPath("#insertTree", values.map(String));
  }

  function searchBst(target) {
    const path = [];
    const log = [];
    function walk(node) {
      if (!node) {
        log.push(`${target} not found`);
        return;
      }
      const value = Number(node.name);
      path.push(node.name);
      if (target === value) log.push(`${target} == ${value} -> found`);
      else if (target < value) {
        log.push(`${target} < ${value} -> left`);
        walk(node.children && node.children[0]);
      } else {
        log.push(`${target} > ${value} -> right`);
        walk(node.children && node.children[1]);
      }
    }
    walk(starterBst);
    renderTree("#bstTree", starterBst);
    document.getElementById("bstLog").innerHTML = log.map(x => `<li>${x}</li>`).join("");
    highlightPath("#bstTree", path);
  }

  function traverse(order) {
    const out = [];
    function visit(node) {
      if (!node) return;
      const left = node.children && node.children[0];
      const right = node.children && node.children[1];
      if (order === "pre") out.push(node.name);
      visit(left);
      if (order === "in") out.push(node.name);
      visit(right);
      if (order === "post") out.push(node.name);
    }
    if (order === "level") {
      const q = [traversalTree];
      while (q.length) {
        const n = q.shift();
        out.push(n.name);
        (n.children || []).filter(Boolean).forEach(child => q.push(child));
      }
    } else {
      visit(traversalTree);
    }
    renderTree("#traversalTree", traversalTree);
    document.getElementById("traversalOutput").textContent = out.join(" ");
    highlightPath("#traversalTree", out);
  }

  function binarySearch(target) {
    const arr = [2, 5, 6, 8, 9, 10, 11, 12, 13, 17, 22, 29, 31];
    const array = document.getElementById("binaryArray");
    const log = document.getElementById("binaryLog");
    array.innerHTML = arr.map((v, i) => `<span class="array-cell" data-i="${i}"><small>${i}</small><strong>${v}</strong></span>`).join("");
    const steps = [];
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({ low, high, mid, text: `low=${low}, high=${high}, mid=${mid}, value=${arr[mid]}` });
      if (arr[mid] === target) break;
      if (target < arr[mid]) high = mid - 1;
      else low = mid + 1;
    }
    log.innerHTML = steps.map(s => `<li>${s.text}</li>`).join("");
    steps.forEach((s, i) => setTimeout(() => {
      array.querySelectorAll(".array-cell").forEach(cell => cell.classList.remove("selected", "active"));
      for (let j = s.low; j <= s.high; j++) array.querySelector(`[data-i="${j}"]`)?.classList.add("selected");
      array.querySelector(`[data-i="${s.mid}"]`)?.classList.add("active");
    }, i * 650));
  }

  function init() {
    renderTree("#anatomyTree", anatomy);
    renderArrayRepresentation();
    renderTree("#bstTree", starterBst);
    renderTree("#insertTree", starterBst);
    renderTree("#traversalTree", traversalTree);
    binarySearch(22);
    searchBst(5);
  }

  return { init, renderTree, highlightPath, renderArrayRepresentation, insertBST, animateTraversal: traverse, binarySearch, searchBst };
})();
