"use client";
import SpectrogramVisualizer from "@/components/visualizers/spectrogram-visualizer";

export default function Page() {
  return (
    <section className="py-8 container max-w-5xl">
      <h1 className="text-3xl font-bold mb-4">Spectrogram Waterfall</h1>
  <p className="text-muted-foreground mb-6">Scrolling time–frequency heatmap using FFT magnitudes.</p>
  <SpectrogramVisualizer />
    </section>
  );
}
