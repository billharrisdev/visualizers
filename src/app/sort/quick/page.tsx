import QuickSortVisualizer from "@/components/visualizers/quick-sort-visualizer";

export default function QuickSortPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Quick Sort</h1>
      <p className="mb-4 text-muted-foreground">
        Quick sort is an efficient sorting algorithm. Developed by British computer scientist Tony Hoare in 1959 and published in 1961, it is still a commonly used algorithm for sorting.
      </p>
      <QuickSortVisualizer />
    </div>
  );
}
