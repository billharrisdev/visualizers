"use client";
import ChromagramVisualizer from "@/components/visualizers/chromagram-visualizer";

export default function Page() {
  return (
    <section className="py-8 container max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">Chromagram / Key Wheel</h1>
      <p className="text-muted-foreground mb-6">12 pitch classes around a ring with key detection (Krumhansl profiles).</p>
      <ChromagramVisualizer />
    </section>
  );
}
