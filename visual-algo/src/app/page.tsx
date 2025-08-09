import VisualizerList from "@/components/visualizer-list";
import { visualizers } from "@/lib/data";

export default async function Home() {
  const initialVisualizers = visualizers.slice(0, 8);

  return (
    <section className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Algorithm Visualizers
      </h1>
      <VisualizerList initialVisualizers={initialVisualizers} />
    </section>
  );
}
