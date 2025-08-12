import VisualizerList from "@/components/visualizer-list";
import { visualizers } from "@/lib/data";

export default async function Home() {
  const sortInitial = visualizers.filter(v => v.section === "sort").slice(0, 8);
  const searchInitial = visualizers.filter(v => v.section === "search").slice(0, 8);

  return (
    <section className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Algorithm Visualizers</h1>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sort</h2>
          <VisualizerList initialVisualizers={sortInitial} section="sort" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Search</h2>
          <VisualizerList initialVisualizers={searchInitial} section="search" />
        </div>
      </div>
    </section>
  );
}
