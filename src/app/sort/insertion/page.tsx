import InsertionSortVisualizer from "@/components/visualizers/insertion-sort-visualizer";

export default function InsertionSortPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Insertion Sort</h1>
      <p className="mb-4 text-muted-foreground">
        Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.
      </p>
      <InsertionSortVisualizer />
    </div>
  );
}
