window.TreeLecture = {
  chunks: [
    {
      id: "chunk-1",
      title: "Chunk 1 - Tree Data Structure Basics",
      pages: "pages 2-4",
      en: "A tree is a non-linear structure made of nodes. The root is at level 0. A parent has children; a leaf has no children. A subtree is any node with all descendants. Height/depth in this lecture is the maximum level.",
      ar: "الشجرة هي هيكل بيانات غير خطي يتكون من عقد. الجذر في المستوى 0. الأب لديه أبناء، والورقة لا تملك أبناء. الشجرة الفرعية هي عقدة مع كل أحفادها. الارتفاع/العمق هو أكبر مستوى في الشجرة.",
      bullets: ["Node, Root, Parent, Child, Leaf, Subtree", "Root level = 0", "Maximum nodes = 2^(h+1)-1", "Full binary tree: actual nodes equal maximum nodes", "Complete binary tree: levels filled left to right", "Edge formula: e = 2(L-1)"],
      check: "If h = 3, max nodes = 2^(4)-1 = 15."
    },
    {
      id: "chunk-2",
      title: "Chunk 2 - Binary Tree Representation Using Arrays",
      pages: "pages 5-9",
      en: "Array representation stores the root at index 0. For a node at index i, left child is 2i+1, right child is 2i+2, and parent is floor((i-1)/2). Empty children keep dummy positions.",
      ar: "تمثيل المصفوفة يضع الجذر في الفهرس 0. إذا كانت العقدة في الفهرس i فالابن الأيسر 2i+1، والأيمن 2i+2، والأب floor((i-1)/2). الأماكن الفارغة تبقى dummy.",
      bullets: ["Array: A B C D E F G - - H I - - J -", "Indices: 0 to 14", "Click node highlights array index", "Click array cell highlights tree node"],
      check: "For index 4, left = 9 and right = 10."
    },
    {
      id: "chunk-3",
      title: "Chunk 3 - Binary Search + BST Concept",
      pages: "pages 10-33",
      en: "Binary search works only on a sorted array: compare target with the middle. If target is smaller go left; if bigger go right. BST applies the same idea to a tree using LEFT < ROOT < RIGHT.",
      ar: "البحث الثنائي يعمل فقط على مصفوفة مرتبة: نقارن الهدف مع الوسط. إذا كان أصغر نذهب يساراً، وإذا أكبر نذهب يميناً. BST تطبق نفس الفكرة على الشجرة: اليسار أصغر من الجذر واليمين أكبر.",
      bullets: ["Binary search: middle element logic", "BST rule: LEFT < ROOT < RIGHT", "BST contains/search follows one path", "Example search for 5: 8 -> 5"],
      check: "At each binary search step, half of the remaining array is removed."
    },
    {
      id: "chunk-4",
      title: "Chunk 4 - BST Insertion + Trace Questions",
      pages: "pages 34-40",
      en: "Insertion compares x with the current node. If x is smaller go left; otherwise go right. If the pointer is NULL, insert the new node there. The lecture uses node<T> *&p so the function can change the caller's pointer.",
      ar: "الإدراج يقارن x مع العقدة الحالية. إذا كان أصغر نذهب يساراً، وإلا نذهب يميناً. إذا وصلنا إلى NULL نضع العقدة الجديدة هناك. تستخدم المحاضرة node<T> *&p حتى تستطيع الدالة تغيير المؤشر الأصلي.",
      bullets: ["Insert 10 trace: 10 > 8 -> right", "10 < 11 -> left", "10 > 9 -> right", "Insert at right of 9", "Values: {8,5,11,2,7,9,12,6,10,13}"],
      check: "*&p means reference to pointer; without &, assigning p = new node would not update the tree link."
    },
    {
      id: "chunk-5",
      title: "Chunk 5 - Tree Traversals",
      pages: "pages 41-53",
      en: "Pre, in, and post traversal differ only by the position of cout. Pre-order prints Root Left Right. In-order prints Left Root Right. Post-order prints Left Right Root. Level-order uses queue/BFS and does not use recursion.",
      ar: "تختلف pre و in و post فقط بمكان cout. Pre-order: الجذر ثم اليسار ثم اليمين. In-order: اليسار ثم الجذر ثم اليمين. Post-order: اليسار ثم اليمين ثم الجذر. Level-order تستخدم queue/BFS ولا تستخدم recursion.",
      bullets: ["Pre-order: F B A D C E G I H", "In-order: A B C D E F G H I", "Post-order: A C E D B H I G F", "Trick: counter-clockwise path; pre left side, in bottom, post right side"],
      check: "For BST, in-order prints values in sorted order."
    }
  ],
  code: [
    ["TreeNode struct", "struct TreeNode {\n    int data;\n    TreeNode *left;\n    TreeNode *right;\n};"],
    ["Insertion", "template <class T>\nvoid Binary_Search_Tree<T>::insertion(node<T> *&p,T x)\n{\n    if (p == NULL)\n    {\n        p = new node<T>;\n        p->data = x;\n        p->left = NULL;\n        p->right = NULL;\n    }\n    else if (x < p->data)\n        insertion(p->left, x);\n    else\n        insertion(p->right, x);\n}"],
    ["Pre-order", "void preorder(TreeNode *p)\n{\n    if (p != NULL)\n    {\n        cout << p->data << \" \";\n        preorder(p->left);\n        preorder(p->right);\n    }\n}"],
    ["In-order", "void inorder(TreeNode *p)\n{\n    if (p != NULL)\n    {\n        inorder(p->left);\n        cout << p->data << \" \";\n        inorder(p->right);\n    }\n}"],
    ["Post-order", "void postorder(TreeNode *p)\n{\n    if (p != NULL)\n    {\n        postorder(p->left);\n        postorder(p->right);\n        cout << p->data << \" \";\n    }\n}"]
  ],
  practice: [
    ["Insert value trace", "Insert 10 into BST {8,5,11,2,7,9,12,6,13}. Answer: 10 > 8, 10 < 11, 10 > 9, insert right of 9."],
    ["Traversal trace", "Given lecture tree, pre-order = F B A D C E G I H, in-order = A B C D E F G H I, post-order = A C E D B H I G F."],
    ["Array index", "For node at index i = 6: left child = 13, right child = 14, parent = 2."],
    ["Binary search trace", "On sorted array, compare target with middle. Smaller target moves high to mid-1; bigger target moves low to mid+1."]
  ],
  quiz: [
    { type: "mcq", q: "What is the root level in the lecture?", choices: ["0", "1", "h", "L"], answer: "0" },
    { type: "mcq", q: "Left child index of node i is:", choices: ["2i+1", "2i+2", "(i-1)/2", "i+1"], answer: "2i+1" },
    { type: "mcq", q: "BST rule is:", choices: ["LEFT < ROOT < RIGHT", "LEFT > ROOT > RIGHT", "ROOT < LEFT < RIGHT", "RIGHT < LEFT < ROOT"], answer: "LEFT < ROOT < RIGHT" },
    { type: "mcq", q: "Level-order traversal uses:", choices: ["Queue/BFS", "Recursion only", "Stack DFS", "Binary search"], answer: "Queue/BFS" },
    { type: "sa", q: "Why is node<T> *&p used in insertion?", answer: "It is a reference to a pointer, so assigning p to a new node updates the actual tree link." },
    { type: "sa", q: "Write the maximum node formula for height h.", answer: "2^(h+1)-1" },
    { type: "sa", q: "Where is 10 inserted in the lecture BST trace?", answer: "As the right child of 9." }
  ],
  cheat: [
    ["Formulas", "Max nodes = 2^(h+1)-1; edges e = 2(L-1)."],
    ["Array", "root = 0; left = 2i+1; right = 2i+2; parent = floor((i-1)/2)."],
    ["BST", "LEFT < ROOT < RIGHT; smaller goes left, bigger/equal goes right."],
    ["Insertion", "If pointer is NULL, insert. Otherwise compare and recurse left/right."],
    ["Traversals", "Pre: Root Left Right. In: Left Root Right. Post: Left Right Root. Level: queue/BFS."]
  ],
  algorithm: {
    method: [
      "Count how many times each line runs.",
      "For nested loops, multiply.",
      "For sequential code blocks, add.",
      "Drop constants.",
      "Keep the dominant term."
    ],
    chunks: [
      {
        title: "Big O Rules",
        pattern: "Trace first, simplify last.",
        trace: ["Drop constants: O(2n) becomes O(n).", "Keep dominant term: O(n² + n) becomes O(n²).", "Sequential parts are added.", "Nested parts are multiplied."],
        result: "Use the biggest growth term as the final answer."
      },
      {
        title: "Linear Complexity O(n)",
        pattern: "for loop from 1 to n",
        code: "for (i = 1; i <= n; i++)\n    statement;",
        trace: ["Loop runs n times.", "Body is O(1).", "n × 1 = n."],
        result: "O(n)"
      },
      {
        title: "Quadratic Complexity O(n²)",
        pattern: "two nested loops both running to n",
        code: "for (i = 1; i <= n; i++)\n    for (j = 1; j <= n; j++)\n        statement;",
        trace: ["Outer loop runs n times.", "Inner loop runs n times for each outer step.", "n × n = n²."],
        result: "O(n²)"
      },
      {
        title: "Sequential vs Nested",
        pattern: "add sequential blocks, multiply nested blocks",
        trace: ["Sequential: O(n) + O(n²) = O(n²).", "Nested: O(n) × O(n) = O(n²)."],
        result: "Look at indentation and loop placement."
      },
      {
        title: "Logarithmic Complexity O(log n)",
        pattern: "i = i * 2, i = i * 3, or n = n / 2",
        code: "for (i = 1; i < n; i = i * 2)\n    statement;",
        trace: ["The value doubles, triples, or halves each step.", "The remaining problem size changes by a constant factor.", "That factor-based shrinking or growing gives log n steps."],
        result: "O(log n)"
      },
      {
        title: "O(n log n)",
        pattern: "outer loop n, inner loop log n",
        code: "for (i = 1; i <= n; i++)\n    for (j = 1; j < n; j = j * 3)\n        statement;",
        trace: ["Outer loop runs n times.", "Inner loop grows by ×3, so it runs log n times.", "n × log n."],
        result: "O(n log n)"
      },
      {
        title: "O(n² log n)",
        pattern: "two loops of n and one logarithmic loop",
        trace: ["First loop: n.", "Second nested loop: n.", "Third nested logarithmic loop: log n.", "n × n × log n."],
        result: "O(n² log n)"
      },
      {
        title: "O(n(log n)²)",
        pattern: "one loop n, two logarithmic nested loops",
        trace: ["Outer loop: n.", "First logarithmic loop: log n.", "Second logarithmic loop: log n.", "n × log n × log n."],
        result: "O(n(log n)²)"
      },
      {
        title: "Fibonacci Recursion O(2ⁿ)",
        pattern: "fib(n-1) + fib(n-2)",
        code: "fib(4)\n├─ fib(3)\n│  ├─ fib(2)\n│  └─ fib(1)\n└─ fib(2)\n   ├─ fib(1)\n   └─ fib(0)",
        trace: ["Each call branches into two smaller calls.", "The trace tree expands quickly as n grows.", "For exam tracing, recognize the branching recursion pattern."],
        result: "O(2ⁿ)"
      },
      {
        title: "Exam Trap: j Is Not Reset",
        pattern: "inner loop variable keeps its value across outer iterations",
        code: "j = 1;\nfor (i = 1; i <= n; i++)\n    while (j <= n) {\n        statement;\n        j++;\n    }",
        trace: ["j starts once before the outer loop.", "The while loop advances j from 1 to n only one time in total.", "Later outer iterations do not restart j."],
        result: "O(n), not O(n²)"
      }
    ],
    recognition: [
      ["one loop", "O(n)"],
      ["two nested loops", "O(n²)"],
      ["three nested loops", "O(n³)"],
      ["divide/multiply by 2 or 3", "O(log n)"],
      ["n loop + log loop nested", "O(n log n)"],
      ["recursive branching", "O(2ⁿ)"],
      ["loop variable not reset", "usually O(n)"]
    ],
    practice: [
      { type: "mcq", q: "Find Big O for one loop from 1 to n.", choices: ["O(1)", "O(n)", "O(n²)", "O(log n)"], answer: "O(n)", why: "The loop body is constant work repeated n times." },
      { type: "mcq", q: "Find Big O for two nested loops, both from 1 to n.", choices: ["O(n)", "O(n²)", "O(log n)", "O(2ⁿ)"], answer: "O(n²)", why: "Nested loops multiply: n × n." },
      { type: "mcq", q: "Find Big O for a loop where i = i * 2 each step.", choices: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], answer: "O(log n)", why: "The loop reaches n by repeated doubling." },
      { type: "mcq", q: "Find Big O for an outer n loop and inner loop j = j * 3.", choices: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: "O(n log n)", why: "The outer loop is n and the inner loop is logarithmic." },
      { type: "mcq", q: "Find Big O for fib(n-1) + fib(n-2).", choices: ["O(n)", "O(log n)", "O(n²)", "O(2ⁿ)"], answer: "O(2ⁿ)", why: "Each call branches into two recursive calls." },
      { type: "mcq", q: "Trick: j is declared before the outer loop and is not reset. What is the usual total?", choices: ["O(n)", "O(n²)", "O(n³)", "O(2ⁿ)"], answer: "O(n)", why: "j advances from 1 to n once across the whole trace." },
      { type: "sa", q: "Short answer: Why is O(n) + O(n²) simplified to O(n²)?", answer: "Sequential blocks are added, then the dominant term n² is kept." },
      { type: "sa", q: "Short answer: In nested loops, when do we multiply counts?", answer: "When one loop runs inside another, the inner work repeats for each outer iteration." }
    ],
    searchKeywords: "Algorithm Analysis Big O Complexity Trace Linear Quadratic Logarithmic Fibonacci Recursion Nested loops Sequential loops Loops O(n) O(n²) O(log n) O(n log n) O(2^n) dominant term drop constants"
  },
  searchKeywords: "جذر عقدة ابن أب ورقة شجرة فرعية مستوى ارتفاع عمق مصفوفة بحث ثنائي إدراج تتبع"
};
