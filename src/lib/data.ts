export type Visualizer = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const visualizers: Visualizer[] = [
  {
    id: "1",
    title: "Bubble Sort",
    description:
      "A simple sorting algorithm that repeatedly steps through the list.",
    href: "/sort/bubble",
  },
  {
    id: "2",
    title: "Insertion Sort",
    description: "Builds the final sorted array one item at a time.",
    href: "/sort/insertion",
  },
  {
    id: "3",
    title: "Selection Sort",
    description:
      "Repeatedly finds the minimum element and puts it at the beginning.",
    href: "/sort/selection",
  },
  {
    id: "4",
    title: "Merge Sort",
    description: "A divide-and-conquer sorting algorithm.",
    href: "/sort/merge",
  },
  {
    id: "5",
    title: "Quick Sort",
    description:
      "An efficient sorting algorithm, serving as a systematic method for placing the elements of an array in order.",
    href: "/sort/quick",
  },
  {
    id: "6",
    title: "Heap Sort",
    description:
      "A comparison-based sorting technique based on Binary Heap data structure.",
    href: "/sort/heap",
  },
  {
    id: "7",
    title: "Linear Search",
    description:
      "Sequentially checks each element of the list until a match is found.",
    href: "/search/linear",
  },
  {
    id: "8",
    title: "Binary Search",
    description: "Finds the position of a target value within a sorted array.",
    href: "/search/binary",
  },
  {
    id: "9",
    title: "A* Search",
    description: "An efficient pathfinding algorithm using heuristics.",
    href: "/search/a-star",
  },
  {
    id: "10",
    title: "Dijkstra's Algorithm",
    description: "Shortest paths in graphs with non-negative weights.",
    href: "/search/dijkstra",
  },
];
