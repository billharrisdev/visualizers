import BinarySearchVisualizer from "@/components/visualizers/binary-search-visualizer";

export default function BinarySearchPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Binary Search</h1>
      <p className="mb-4 text-muted-foreground">
        Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you&apos;ve narrowed down the possible locations to just one.
      </p>
      <BinarySearchVisualizer />
    </div>
  );
}
