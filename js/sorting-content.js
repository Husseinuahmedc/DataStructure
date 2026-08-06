window.SortingLecture = {
  source: "Lecture 6: Sorting Algorithms",
  tabs: [
    ["selection", "Selection Sort"],
    ["bubble", "Bubble Sort"],
    ["merge", "Merge Sort"],
    ["insertion", "Insertion Sort"],
    ["quick", "Quick Sort"]
  ],
  overview: [
    {
      key: "selection",
      title: "Selection Sort Trace",
      pages: "pages 1-2",
      idea: "Select the smallest element in the unsorted part, then move it to the top of that unsorted part.",
      trace: "Minimum search, pass result, and fixed left-side positions.",
      exam: "Trace by finding the minimum each pass. Usually one swap per pass.",
      example: "16, 30, 24, 7, 62, 45, 5, 55",
      mistake: "Do not swap every comparison. Swap only after the pass minimum is known."
    },
    {
      key: "bubble",
      title: "Bubble Sort Trace",
      pages: "pages 3-4",
      idea: "Compare successive elements list[index] and list[index + 1]. Swap when the left item is greater.",
      trace: "Adjacent comparisons, swaps, and the fixed largest value after each pass.",
      exam: "Trace adjacent comparisons. Largest element becomes fixed at the end after each pass.",
      example: "5, 1, 2, 4, 3, 7, 6",
      mistake: "Do not compare non-adjacent values."
    },
    {
      key: "merge",
      title: "Merge Sort Divide/Merge Trace",
      pages: "pages 5-6",
      idea: "Use divide-and-conquer: divide into halves, then merge the pieces in sorted order.",
      trace: "Divide levels, single-element groups, and sorted merge levels.",
      exam: "Draw divide levels first, then merge levels.",
      example: "35, 28, 18, 45, 62, 48, 30, 38",
      mistake: "Do not sort during the divide stage. Ordering happens during merge."
    },
    {
      key: "insertion",
      title: "Insertion Sort Pass Trace",
      pages: "pages 7-10",
      idea: "Move each element to its proper place in the sorted portion of the list.",
      trace: "Pass p, key value, right shifts, insertion position, and positions moved.",
      exam: "Trace p = 1 to N - 1. Count positions moved.",
      example: "34, 8, 64, 51, 32, 21",
      mistake: "Do not lose the key while shifting larger values right."
    },
    {
      key: "quick",
      title: "Quick Sort Partition Trace",
      pages: "page 11",
      idea: "Use divide-and-conquer: partition the list into two sublists, then combine them into a sorted list.",
      trace: "Pivot choice, partition scan, pivot final place, then left and right subarrays.",
      exam: "Show pivot choice, partition result, pivot location, then recurse left/right.",
      example: "35, 28, 18, 45, 62, 48, 30, 38",
      mistake: "Do not treat the pivot as sorted until the partition places it."
    }
  ],
  traces: {
    selection: {
      title: "Selection Sort Trace",
      rule: "Each pass finds the smallest element in the unsorted list and swaps it with the first element of that part.",
      array: [16, 30, 24, 7, 62, 45, 5, 55],
      rows: [
        ["Initial", "—", [16, 30, 24, 7, 62, 45, 5, 55]],
        ["Pass 1", "min = 5; swap index 0 with index 6", [5, 30, 24, 7, 62, 45, 16, 55]],
        ["Pass 2", "min = 7; swap index 1 with index 3", [5, 7, 24, 30, 62, 45, 16, 55]],
        ["Pass 3", "min = 16; swap index 2 with index 6", [5, 7, 16, 30, 62, 45, 24, 55]],
        ["Pass 4", "min = 24; swap index 3 with index 6", [5, 7, 16, 24, 62, 45, 30, 55]],
        ["Pass 5", "min = 30; swap index 4 with index 6", [5, 7, 16, 24, 30, 45, 62, 55]],
        ["Pass 6", "min = 45; no swap", [5, 7, 16, 24, 30, 45, 62, 55]],
        ["Pass 7", "min = 55; swap index 6 with index 7", [5, 7, 16, 24, 30, 45, 55, 62]]
      ],
      checkpoints: ["Sorted part grows from the left.", "The unsorted part shrinks after every pass.", "Final sorted array: 5, 7, 16, 24, 30, 45, 55, 62."]
    },
    bubble: {
      title: "Bubble Sort Trace",
      rule: "Compare adjacent items. If left > right, swap. Smaller elements move toward the top; larger elements move toward the bottom.",
      examples: [
        {
          title: "Example 1 — first pass on 5, 1, 2, 4, 3, 7, 6",
          rows: [
            ["Initial", "—", [5, 1, 2, 4, 3, 7, 6]],
            ["Compare 5 and 1", "swap", [1, 5, 2, 4, 3, 7, 6]],
            ["Compare 5 and 2", "swap", [1, 2, 5, 4, 3, 7, 6]],
            ["Compare 5 and 4", "swap", [1, 2, 4, 5, 3, 7, 6]],
            ["Compare 5 and 3", "swap", [1, 2, 4, 3, 5, 7, 6]],
            ["Compare 5 and 7", "no swap", [1, 2, 4, 3, 5, 7, 6]],
            ["Compare 7 and 6", "swap", [1, 2, 4, 3, 5, 6, 7]]
          ]
        },
        {
          title: "Example 2 — first two passes on 29, 10, 14, 37, 13",
          rows: [
            ["Initial", "—", [29, 10, 14, 37, 13]],
            ["Pass 1: 29/10, 29/14, 29/37, 37/13", "swap, swap, no swap, swap", [10, 14, 29, 13, 37]],
            ["Pass 2: 10/14, 14/29, 29/13", "no swap, no swap, swap", [10, 14, 13, 29, 37]]
          ]
        }
      ],
      checkpoints: ["After pass 1, the largest item is fixed at the last position.", "After pass 2, the second largest item is fixed before it.", "Only adjacent elements are compared."]
    },
    merge: {
      title: "Merge Sort Divide/Merge Trace",
      rule: "First divide the array into halves until single elements. Then merge back in sorted order.",
      examples: [
        {
          title: "Example 1 — 35, 28, 18, 45, 62, 48, 30, 38",
          rows: [
            ["Start", "35 28 18 45 62 48 30 38"],
            ["Divide 1", "[35 28 18 45] | [62 48 30 38]"],
            ["Divide 2", "[35 28] | [18 45] | [62 48] | [30 38]"],
            ["Singles", "[35] [28] [18] [45] [62] [48] [30] [38]"],
            ["Merge 1", "[28 35] | [18 45] | [48 62] | [30 38]"],
            ["Merge 2", "[18 28 35 45] | [30 38 48 62]"],
            ["Final", "18 28 30 35 38 45 48 62"]
          ]
        },
        {
          title: "Example 2 — 75, 40, 10, 90, 50, 95, 55, 15, 65",
          rows: [
            ["Start", "75 40 10 90 50 95 55 15 65"],
            ["Divide 1", "[75 40 10 90 50] | [95 55 15 65]"],
            ["Divide 2", "[75 40 10] | [90 50] | [95 55] | [15 65]"],
            ["Divide 3", "[75 40] | [10] | [90] [50] | [95] [55] | [15] [65]"],
            ["Merge 1", "[40 75] | [50 90] | [55 95] | [15 65]"],
            ["Merge 2", "[10 40 75] | [50 90] | [15 55 65 95]"],
            ["Merge 3", "[10 40 50 75 90] | [15 55 65 95]"],
            ["Final", "10 15 40 50 55 65 75 90 95"]
          ]
        }
      ],
      checkpoints: ["Divide side is not sorted yet.", "Sorting happens during merge.", "Final merge combines two already sorted lists."]
    },
    insertion: {
      title: "Insertion Sort Pass Trace",
      rule: "For pass p = 1 through N - 1, positions 0 through p become sorted. Move the item at p left until its correct place is found.",
      examples: [
        {
          title: "Lecture sample — 34, 8, 64, 51, 32, 21",
          rows: [
            ["Original", "—", [34, 8, 64, 51, 32, 21], "—"],
            ["p = 1", "8", [8, 34, 64, 51, 32, 21], "1"],
            ["p = 2", "64", [8, 34, 64, 51, 32, 21], "0"],
            ["p = 3", "51", [8, 34, 51, 64, 32, 21], "1"],
            ["p = 4", "32", [8, 32, 34, 51, 64, 21], "3"],
            ["p = 5", "21", [8, 21, 32, 34, 51, 64], "4"]
          ]
        },
        {
          title: "Example 1 — 29, 10, 14, 37, 13",
          rows: [
            ["Original", "—", [29, 10, 14, 37, 13], "—"],
            ["p = 1", "10", [10, 29, 14, 37, 13], "1"],
            ["p = 2", "14", [10, 14, 29, 37, 13], "1"],
            ["p = 3", "37", [10, 14, 29, 37, 13], "0"],
            ["p = 4", "13", [10, 13, 14, 29, 37], "3"]
          ],
          shift: ["key = 13", "shift 37 right", "shift 29 right", "shift 14 right", "insert 13 after 10"]
        },
        {
          title: "Example 2 — 5, 6, 2, 4, 7, 3, 1",
          rows: [
            ["Original", "—", [5, 6, 2, 4, 7, 3, 1], "—"],
            ["p = 1", "6", [5, 6, 2, 4, 7, 3, 1], "0"],
            ["p = 2", "2", [2, 5, 6, 4, 7, 3, 1], "2"],
            ["p = 3", "4", [2, 4, 5, 6, 7, 3, 1], "2"],
            ["p = 4", "7", [2, 4, 5, 6, 7, 3, 1], "0"],
            ["p = 5", "3", [2, 3, 4, 5, 6, 7, 1], "4"],
            ["p = 6", "1", [1, 2, 3, 4, 5, 6, 7], "6"]
          ]
        }
      ],
      checkpoints: ["The left side is always sorted.", "Positions moved = number of shifted larger elements.", "If the key is already larger than the sorted part, positions moved = 0."]
    },
    quick: {
      title: "Quick Sort Partition Trace",
      rule: "Choose a pivot, partition into values smaller than pivot and values greater than or equal to pivot, then apply the same idea to each subarray.",
      partitionRule: "Lecture partition style: swap middle element to first position, use it as pivot, move values smaller than pivot to the left, then place pivot at smallIndex.",
      firstPartition: [
        ["Initial", "—", [35, 28, 18, 45, 62, 48, 30, 38]],
        ["Choose pivot", "middle value 45; swap with first", [45, 28, 18, 35, 62, 48, 30, 38]],
        ["Scan", "28, 18, 35 are smaller than 45", [45, 28, 18, 35, 62, 48, 30, 38]],
        ["Scan", "30 is smaller; move before larger values", [45, 28, 18, 35, 30, 48, 62, 38]],
        ["Scan", "38 is smaller; move before larger values", [45, 28, 18, 35, 30, 38, 62, 48]],
        ["Place pivot", "swap pivot with index 5", [38, 28, 18, 35, 30, 45, 62, 48]]
      ],
      recursiveRows: [
        ["0-7", "pivot 45", "[38 28 18 35 30] | 45 | [62 48]"],
        ["0-4", "pivot 18", "[] | 18 | [28 38 35 30]"],
        ["1-4", "pivot 38", "[30 28 35] | 38 | []"],
        ["1-3", "pivot 28", "[] | 28 | [30 35]"],
        ["2-3", "pivot 30", "[] | 30 | [35]"],
        ["6-7", "pivot 62", "[48] | 62 | []"],
        ["Final", "—", "18 28 30 35 38 45 48 62"]
      ],
      checkpoints: ["Pivot becomes fixed after partition.", "Left side contains smaller values.", "Right side contains greater/equal values.", "Then sort left and right sublists."]
    }
  },
  cheat: [
    ["Selection Sort", "Find minimum in unsorted part, swap it with the first unsorted position. Sorted part grows left to right."],
    ["Bubble Sort", "Compare adjacent elements. If left > right, swap. Largest unsorted value becomes fixed at the end of each pass."],
    ["Merge Sort", "Divide into halves until singles, then merge sorted groups. The merge stage is where ordering happens."],
    ["Insertion Sort", "Pass p inserts the element at index p into positions 0 through p. Count shifted positions."],
    ["Quick Sort", "Pick pivot, partition smaller values left and greater/equal values right, then repeat for subarrays."],
    ["Exam Trace Rule", "Write the array after every pass, swap, shift, merge, or partition step requested by the question."]
  ],
  practice: [
    {
      type: "sa",
      q: "Selection Sort: trace the first two passes of 16, 30, 24, 7, 62, 45, 5, 55.",
      answer: "Pass 1: 5, 30, 24, 7, 62, 45, 16, 55. Pass 2: 5, 7, 24, 30, 62, 45, 16, 55."
    },
    {
      type: "sa",
      q: "Bubble Sort: give the first pass of 5, 1, 2, 4, 3, 7, 6.",
      answer: "1, 2, 4, 3, 5, 6, 7."
    },
    {
      type: "sa",
      q: "Insertion Sort: for 29, 10, 14, 37, 13, what is the array after p = 4?",
      answer: "10, 13, 14, 29, 37. Positions moved = 3."
    },
    {
      type: "sa",
      q: "Merge Sort: final sorted result for 35, 28, 18, 45, 62, 48, 30, 38.",
      answer: "18, 28, 30, 35, 38, 45, 48, 62."
    },
    {
      type: "sa",
      q: "Quick Sort: after partitioning 35, 28, 18, 45, 62, 48, 30, 38 with pivot 45, where is pivot placed?",
      answer: "Pivot 45 is placed after the smaller values: 38, 28, 18, 35, 30, 45, 62, 48. Pivot location = index 5."
    },
    {
      type: "mcq",
      q: "Which sorting algorithm requires drawing divide and merge levels?",
      choices: ["Selection Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"],
      answer: "Merge Sort"
    },
    {
      type: "mcq",
      q: "In Bubble Sort, what becomes fixed after the first full pass?",
      choices: ["Smallest at first", "Largest at last", "Pivot in middle", "All values sorted"],
      answer: "Largest at last"
    }
  ],
  searchKeywords: "Sorting Algorithms Selection Sort Bubble Sort Merge Sort Insertion Sort Quick Sort trace pass swap shift positions moved divide merge pivot partition sorted unsorted final exam"
};
