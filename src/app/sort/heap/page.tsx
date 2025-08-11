import HeapSortVisualizer from "@/components/visualizers/heap-sort-visualizer";

export default function HeapSortPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Heap Sort</h1>
      <p className="mb-4 text-muted-foreground">
        Heap sort is a comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end.
      </p>
      <HeapSortVisualizer />
    </div>
  );
}
