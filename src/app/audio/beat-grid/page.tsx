"use client";
import BeatGridVisualizer from "@/components/visualizers/beat-grid-visualizer";

export default function Page() {
  return (
    <section className="py-8 container max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">Beat Grid & BPM</h1>
  <p className="text-muted-foreground mb-6">Live onset detection with spectral flux, adaptive threshold, and BPM estimate.</p>
  <BeatGridVisualizer />
    </section>
  );
}
