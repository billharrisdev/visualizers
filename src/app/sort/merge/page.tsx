import MergeSortVisualizer from "@/components/visualizers/merge-sort-visualizer";

export default function MergeSortPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Merge Sort</h1>
      <p className="mb-4 text-muted-foreground">
        Merge sort is an efficient, stable, comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output.
      </p>
      <MergeSortVisualizer />
    </div>
  );
}
