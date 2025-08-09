export type Visualizer = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const visualizers: Visualizer[] = [
  { id: "1", title: "Bubble Sort", description: "A simple sorting algorithm that repeatedly steps through the list.", href: "/sort/bubble" },
  { id: "2", title: "Insertion Sort", description: "Builds the final sorted array one item at a time.", href: "/sort/insertion" },
  { id: "3", title: "Selection Sort", description: "Repeatedly finds the minimum element and puts it at the beginning.", href: "/sort/selection" },
  { id: "4", title: "Merge Sort", description: "A divide-and-conquer sorting algorithm.", href: "/sort/merge" },
  { id: "5", title: "Quick Sort", description: "An efficient sorting algorithm, serving as a systematic method for placing the elements of an array in order.", href: "/sort/quick" },
  { id: "6", title: "Heap Sort", description: "A comparison-based sorting technique based on Binary Heap data structure.", href: "/sort/heap" },
  { id: "7", title: "Linear Search", description: "Sequentially checks each element of the list until a match is found.", href: "/search/linear" },
  { id: "8", title: "Binary Search", description: "Finds the position of a target value within a sorted array.", href: "/search/binary" },
  { id: "17", title: "A* Search", description: "An efficient pathfinding algorithm using heuristics.", href: "/search/a-star" },
  { id: "9", title: "Bubble Sort 2", description: "A simple sorting algorithm that repeatedly steps through the list.", href: "/sort/bubble" },
  { id: "10", title: "Insertion Sort 2", description: "Builds the final sorted array one item at a time.", href: "/sort/insertion" },
  { id: "11", title: "Selection Sort 2", description: "Repeatedly finds the minimum element and puts it at the beginning.", href: "/sort/selection" },
  { id: "12", title: "Merge Sort 2", description: "A divide-and-conquer sorting algorithm.", href: "/sort/merge" },
  { id: "13", title: "Quick Sort 2", description: "An efficient sorting algorithm, serving as a systematic method for placing the elements of an array in order.", href: "/sort/quick" },
  { id: "14", title: "Heap Sort 2", description: "A comparison-based sorting technique based on Binary Heap data structure.", href: "/sort/heap" },
  { id: "15", title: "Linear Search 2", description: "Sequentially checks each element of the list until a match is found.", href: "/search/linear" },
  { id: "16", title: "Binary Search 2", description: "Finds the position of a target value within a sorted array.", href: "/search/binary" },
];
