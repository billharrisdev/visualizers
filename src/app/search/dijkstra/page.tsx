import DijkstraVisualizer from "@/components/visualizers/dijkstra-visualizer";

export default function DijkstraPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dijkstra&apos;s Algorithm</h1>
      <p className="mb-4 text-muted-foreground">
        Dijkstra&apos;s Algorithm finds the shortest path from a start node to
        all other nodes in a graph with non-negative edge weights. On this grid,
        each move has unit cost.
      </p>
      <DijkstraVisualizer />
    </div>
  );
}
