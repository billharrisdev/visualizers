export type Visualizer = {
  id: string;
  title: string;
  description: string;
  href: string;
  section: "sort" | "search";
};

export const visualizers: Visualizer[] = [
  {
    id: "1",
    title: "Bubble Sort",
    description:
      "A simple sorting algorithm that repeatedly steps through the list. Time: O(n^2) avg/worst, O(n) best (already sorted). Space: O(1).",
    href: "/sort/bubble",
    section: "sort",
  },
  {
    id: "2",
    title: "Insertion Sort",
    description:
      "Builds the final sorted array one item at a time. Time: O(n^2) avg/worst, O(n) best (nearly sorted). Space: O(1).",
    href: "/sort/insertion",
    section: "sort",
  },
  {
    id: "3",
    title: "Selection Sort",
    description:
      "Repeatedly finds the minimum element and puts it at the beginning. Time: O(n^2). Space: O(1).",
    href: "/sort/selection",
    section: "sort",
  },
  {
    id: "4",
    title: "Merge Sort",
    description:
      "A divide-and-conquer sorting algorithm. Time: O(n log n) (all cases). Space: O(n).",
    href: "/sort/merge",
    section: "sort",
  },
  {
    id: "5",
    title: "Quick Sort",
    description:
      "An efficient divide-and-conquer sort. Time: O(n log n) avg/best, O(n^2) worst (bad pivots). Space: O(log n) recursion avg.",
    href: "/sort/quick",
    section: "sort",
  },
  {
    id: "6",
    title: "Heap Sort",
    description:
      "A comparison sort using a binary heap. Time: O(n log n). Space: O(1) extra (in-place).",
    href: "/sort/heap",
    section: "sort",
  },
  {
    id: "7",
    title: "Linear Search",
    description:
      "Sequentially checks each element until a match is found. Time: O(n). Space: O(1).",
    href: "/search/linear",
    section: "search",
  },
  {
    id: "8",
    title: "Binary Search",
    description:
      "Finds the position of a target within a sorted array. Time: O(log n). Space: O(1) iterative (O(log n) recursive).",
    href: "/search/binary",
    section: "search",
  },
  {
    id: "9",
    title: "A* Search",
    description:
      "Pathfinding with heuristics (admissible/consistent). Time: O(b^d) worst-case; practical depends on heuristic. Space: O(b^d).",
    href: "/search/a-star",
    section: "search",
  },
  {
    id: "10",
    title: "Dijkstra's Algorithm",
    description:
      "Shortest paths in graphs with non-negative weights. Time: O((V+E) log V) with a binary heap. Space: O(V+E).",
    href: "/search/dijkstra",
    section: "search",
  },
];
