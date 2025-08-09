import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MoreAlgorithmsPage() {
  const sortingAlgos = [
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "Radix Sort",
    "Bucket Sort",
  ];

  const searchingAlgos = [
    "Linear Search",
    "Depth First Search (DFS)",
    "Breadth First Search (BFS)",
  ];

  const graphAlgos = [
    "Dijkstra's Algorithm",
    "A* Search",
    "Bellman-Ford Algorithm",
    "Floyd-Warshall Algorithm",
    "Kruskal's Algorithm",
    "Prim's Algorithm",
  ];

  const otherAlgos = [
    "Tower of Hanoi",
    "N-Queens Problem",
    "Kadane's Algorithm",
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Future Algorithm Visualizers</h1>
      <p className="mb-8 text-muted-foreground">
        Here is a list of other algorithms we plan to visualize in the future.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sorting Algorithms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {sortingAlgos.map((algo) => (
                <li key={algo}>{algo}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Searching Algorithms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {searchingAlgos.map((algo) => (
                <li key={algo}>{algo}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Graph Algorithms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {graphAlgos.map((algo) => (
                <li key={algo}>{algo}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Other Algorithms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {otherAlgos.map((algo) => (
                <li key={algo}>{algo}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
