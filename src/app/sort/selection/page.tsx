import SelectionSortVisualizer from "@/components/visualizers/selection-sort-visualizer";

export default function SelectionSortPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Selection Sort</h1>
      <p className="mb-4 text-muted-foreground">
        Selection sort is an in-place comparison sorting algorithm. It has an O(n<sup>2</sup>) time complexity, which makes it inefficient on large lists, and generally performs worse than the similar insertion sort.
      </p>
      <SelectionSortVisualizer />
    </div>
  );
}
