import AStarVisualizer from "@/components/visualizers/a-star-visualizer";

export default function AStarPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">A* Search Algorithm</h1>
      <p className="mb-4 text-muted-foreground">
        A* is a popular and efficient pathfinding algorithm that is widely used in games and robotics. It finds the shortest path between a start and an end node by considering both the cost from the start and a heuristic estimate to the end.
      </p>
      <AStarVisualizer />
    </div>
  );
}
