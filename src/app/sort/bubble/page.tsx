import BubbleSortVisualizer from "@/components/visualizers/bubble-sort-visualizer";

export default function BubbleSortPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Bubble Sort</h1>
      <p className="mb-4 text-muted-foreground">
        Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.
      </p>
      <BubbleSortVisualizer />
    </div>
  );
}
