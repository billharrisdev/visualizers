import VisualizerList from "@/components/visualizer-list";
import { visualizers } from "@/lib/data"; // We can get the first page of data directly

export default async function Home() {
  // In a real app, you would fetch this from your API
  // const response = await fetch("http://localhost:3000/api/visualizers?page=1&limit=8")
  // const data = await response.json()
  // const initialVisualizers = data.visualizers

  // For simplicity, we'll just take the first 8 from our mock data
  const initialVisualizers = visualizers.slice(0, 8);


  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Algorithm Visualizers</h1>
      <VisualizerList initialVisualizers={initialVisualizers} />
    </div>
  );
}
